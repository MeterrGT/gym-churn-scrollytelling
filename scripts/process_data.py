"""
Gym Churn US Data Processing Script
Processes data/raw/gym_churn_us.csv into structured summaries for notebooks and web app.
Dataset: Adrian Vinueza - Gym Customers Features and Churn (Kaggle)
Nature: 4,000-observation public dataset; literature identifies these records as simulated for educational and analytical use.
License: Listed as CC BY-NC-SA 4.0 on the Kaggle dataset page (manual verification recommended).
"""

import os
import json
import pandas as pd
import numpy as np

def process_gym_churn(
    raw_path='data/raw/gym_churn_us.csv',
    processed_dir='data/processed',
    public_data_dir='public/data'
):
    print(f"Loading dataset from {raw_path}...")
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Data file not found at: {raw_path}")

    df = pd.read_csv(raw_path)
    total_rows, total_cols = df.shape
    print(f"Loaded {total_rows} observations and {total_cols} variables.")

    # 1. Validate Schema and Types
    expected_cols = [
        'gender', 'Near_Location', 'Partner', 'Promo_friends', 'Phone',
        'Contract_period', 'Group_visits', 'Age', 'Avg_additional_charges_total',
        'Month_to_end_contract', 'Lifetime', 'Avg_class_frequency_total',
        'Avg_class_frequency_current_month', 'Churn'
    ]
    missing_cols = [col for col in expected_cols if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing expected columns: {missing_cols}")

    # Check nulls and duplicates
    null_counts = df.isnull().sum().sum()
    duplicate_rows = df.duplicated().sum()
    print(f"Total nulls: {null_counts}, duplicate rows: {duplicate_rows}")

    # Overall Metrics (Exact: 1061 / 4000 = 0.26525 = 26.525%)
    overall_churn_count = int(df['Churn'].sum())
    overall_churn_rate = float(df['Churn'].mean())
    # Standardize display to 26.5%
    overall_churn_pct = round(overall_churn_rate * 100, 1)
    print(f"Overall Churn: {overall_churn_count}/{total_rows} ({overall_churn_pct}%)")

    # Ensure output directories exist
    os.makedirs(processed_dir, exist_ok=True)
    os.makedirs(public_data_dir, exist_ok=True)

    # 2. Churn by Contract Period (1, 6, 12 months)
    contract_labels = {1: '1 Ay (Aylık)', 6: '6 Ay (Yarım Yıl)', 12: '12 Ay (Yıllık)'}
    by_contract = df.groupby('Contract_period')['Churn'].agg(
        Total_Count='count',
        Churn_Count='sum',
        Churn_Rate='mean'
    ).reset_index()
    by_contract['Churn_Percentage'] = (by_contract['Churn_Rate'] * 100).round(2)
    by_contract['Label'] = by_contract['Contract_period'].map(contract_labels)
    by_contract['Share_Percentage'] = ((by_contract['Total_Count'] / total_rows) * 100).round(2)

    by_contract = by_contract[['Contract_period', 'Label', 'Total_Count', 'Churn_Count', 'Churn_Rate', 'Churn_Percentage', 'Share_Percentage']]

    # 3. Churn by Age Groups (18-25, 26-29, 30-33, 34+)
    age_bins = [17, 25, 29, 33, 50]
    age_labels = ['18-25', '26-29', '30-33', '34+']
    df['Age_Group'] = pd.cut(df['Age'], bins=age_bins, labels=age_labels)

    by_age = df.groupby('Age_Group', observed=False)['Churn'].agg(
        Total_Count='count',
        Churn_Count='sum',
        Churn_Rate='mean'
    ).reset_index()
    by_age['Churn_Percentage'] = (by_age['Churn_Rate'] * 100).round(2)
    by_age['Label'] = by_age['Age_Group'].astype(str) + ' Yaş'
    by_age['Share_Percentage'] = ((by_age['Total_Count'] / total_rows) * 100).round(2)
    by_age = by_age[['Age_Group', 'Label', 'Total_Count', 'Churn_Count', 'Churn_Rate', 'Churn_Percentage', 'Share_Percentage']]

    # 4. Age Group x Contract Period Interaction (12 cells)
    by_combined = df.groupby(['Age_Group', 'Contract_period'], observed=False)['Churn'].agg(
        Total_Count='count',
        Churn_Count='sum',
        Churn_Rate='mean'
    ).reset_index()
    by_combined['Churn_Percentage'] = (by_combined['Churn_Rate'] * 100).round(2)
    by_combined['Contract_Label'] = by_combined['Contract_period'].map(contract_labels)

    # 5. Churn by Lifetime / Tenure Categories
    df['Lifetime_Bucket'] = df['Lifetime'].apply(lambda x: str(x) if x < 6 else '6+')
    lifetime_order = ['0', '1', '2', '3', '4', '5', '6+']
    by_lifetime = df.groupby('Lifetime_Bucket')['Churn'].agg(
        Total_Count='count',
        Churn_Count='sum',
        Churn_Rate='mean'
    ).reindex(lifetime_order).reset_index()
    by_lifetime['Churn_Percentage'] = (by_lifetime['Churn_Rate'] * 100).round(2)
    by_lifetime['Label'] = by_lifetime['Lifetime_Bucket'].apply(
        lambda x: f"{x}. Ay" if x != '6+' else "6+ Ay (Sadık)"
    )

    # 6. Churn by Weekly Class Frequency in Current Month
    freq_bins = [-0.1, 0.5, 1.5, 2.5, 3.5, 10.0]
    freq_labels = ['0-0.5 Gün', '1 Gün', '2 Gün', '3 Gün', '4+ Gün']
    df['Freq_Bucket'] = pd.cut(df['Avg_class_frequency_current_month'], bins=freq_bins, labels=freq_labels)
    by_freq = df.groupby('Freq_Bucket', observed=False)['Churn'].agg(
        Total_Count='count',
        Churn_Count='sum',
        Churn_Rate='mean'
    ).reset_index()
    by_freq['Churn_Percentage'] = (by_freq['Churn_Rate'] * 100).round(2)

    # 7. Summary Metrics
    c1_rate = float(by_contract.loc[by_contract['Contract_period'] == 1, 'Churn_Rate'].iloc[0])
    c6_rate = float(by_contract.loc[by_contract['Contract_period'] == 6, 'Churn_Rate'].iloc[0])
    c12_rate = float(by_contract.loc[by_contract['Contract_period'] == 12, 'Churn_Rate'].iloc[0])

    # Unrounded calculation for percentage-point difference: (42.31989% - 2.39583% = 39.924% -> 39.9 pp)
    unrounded_delta_pp = round((c1_rate - c12_rate) * 100, 1)

    peak_cell = by_combined.loc[by_combined['Churn_Percentage'].idxmax()]
    min_cell = by_combined.loc[by_combined['Churn_Percentage'].idxmin()]

    summary_metrics = {
        'total_observations': total_rows,
        'total_features': total_cols,
        'overall_churn_count': overall_churn_count,
        'overall_churn_rate': overall_churn_rate,
        'overall_churn_percentage': 26.5,
        'overall_churn_percentage_exact': round(overall_churn_rate * 100, 3),
        'contract_1m_churn_percentage': round(c1_rate * 100, 1),
        'contract_6m_churn_percentage': round(c6_rate * 100, 1),
        'contract_12m_churn_percentage': round(c12_rate * 100, 1),
        'contract_delta_1m_vs_12m_pp': unrounded_delta_pp,
        'peak_risk_segment': {
            'age_group': str(peak_cell['Age_Group']),
            'contract_period': int(peak_cell['Contract_period']),
            'churn_percentage': round(float(peak_cell['Churn_Percentage']), 1),
            'total_count': int(peak_cell['Total_Count'])
        },
        'lowest_churn_segment': {
            'age_group': str(min_cell['Age_Group']),
            'contract_period': int(min_cell['Contract_period']),
            'churn_percentage': round(float(min_cell['Churn_Percentage']), 1),
            'total_count': int(min_cell['Total_Count'])
        },
        'mean_age': round(float(df['Age'].mean()), 2),
        'avg_class_freq_retained': round(float(df[df['Churn'] == 0]['Avg_class_frequency_current_month'].mean()), 2),
        'avg_class_freq_churned': round(float(df[df['Churn'] == 1]['Avg_class_frequency_current_month'].mean()), 2),
        'dataset_source': 'Kaggle: Adrian Vinueza - Gym Customers Features and Churn',
        'dataset_url': 'https://www.kaggle.com/datasets/adrianvinueza/gym-customers-features-and-churn',
        'dataset_nature': 'Public dataset (4,000 observations); literature describes records as simulated for educational and analytical purposes.',
        'dataset_license': 'Listed as CC BY-NC-SA 4.0 on Kaggle dataset page (manual verification recommended)'
    }

    # Save to both data/processed/ and public/data/
    for folder in [processed_dir, public_data_dir]:
        by_contract.to_csv(os.path.join(folder, 'churn_by_contract.csv'), index=False)
        by_age.to_csv(os.path.join(folder, 'churn_by_age.csv'), index=False)
        by_combined.to_csv(os.path.join(folder, 'churn_combined.csv'), index=False)
        by_lifetime.to_csv(os.path.join(folder, 'churn_by_lifetime.csv'), index=False)
        by_freq.to_csv(os.path.join(folder, 'churn_by_frequency.csv'), index=False)
        with open(os.path.join(folder, 'churn_summary_metrics.json'), 'w', encoding='utf-8') as f:
            json.dump(summary_metrics, f, indent=2, ensure_ascii=False)

    print(f"Successfully exported all processed data to {processed_dir}/ and {public_data_dir}/.")
    return summary_metrics

if __name__ == '__main__':
    metrics = process_gym_churn()
    print("\nSummary metrics generated:")
    print(json.dumps(metrics, indent=2, ensure_ascii=False))
