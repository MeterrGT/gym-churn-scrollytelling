# GitHub `main` Dalı Koruma Kuralları Yapılandırma Kılavuzu (Branch Protection Guide)

**Depo:** `https://github.com/MeterrGT/gym-churn-scrollytelling`  
**Hedef Dal:** `main` (Üretim Dalı)  
**Öğrenci:** Metehan Gezer (2516016026)  
**Tarih:** 30 Ekim 2026  

---

## 1. Durum Tespiti (Status: MANUAL ACTION REQUIRED / BLOCKED)

GitHub API belirteçleri depodaki yönetimsel ayarları (`Settings > Branches`) değiştirme yetkisine sahip olmadığından, `main` dalı koruma kuralları depo sahibi tarafından GitHub arayüzünden manuel olarak aktifleştirilmelidir.

Aşağıdaki adımlar, üretim dalını yetkisiz veya kontrolsüz doğrudan push (`git push origin main`) işlemlerinden korumak için gereken **resmi ve asgari kuralları** içermektedir.

---

## 2. Adım Adım Yapılandırma Talimatı

1. Tarayıcınızda depo ayarlarına gidin:
   `https://github.com/MeterrGT/gym-churn-scrollytelling/settings/branches`
2. **"Add branch protection rule"** (veya **"Add rule"**) butonuna tıklayın.
3. **Branch name pattern** alanına tam olarak şunu yazın:
   ```text
   main
   ```
4. Aşağıdaki güvenlik seçeneklerini işaretleyin:
   - [x] **Require a pull request before merging** (Birleştirmeden önce Pull Request zorunlu kıl)
     - [x] *Require approvals:* En az `1` onay.
     - [x] *Dismiss stale pull request approvals when new commits are pushed* (Yeni commit atıldığında eski onayları geçersiz kıl).
   - [x] **Require status checks to pass before merging** (Birleştirmeden önce durum denetimlerinin geçmesini zorunlu kıl)
     - [x] *Require branches to be up to date before merging* (Dalın güncel olmasını zorunlu kıl).
     - Durum denetimi arama çubuğundan şu CI işlerini seçin:
       - `Secret Scanning (Gitleaks)`
       - `Dependency Vulnerability Audit`
       - `Automated Privacy & Zero-Retention Verification`
       - `Production Build Verification`
   - [x] **Require conversation resolution before merging** (Tüm PR yorumlarının çözülmesini zorunlu kıl).
   - [x] **Require signed commits** (GPG imzalı commit zorunluluğu).
   - [x] **Do not allow bypassing the above settings** (Yöneticilerin dahi bu kuralları çiğnemesini engelle).
   - [x] **Block force pushes** (Zorla push (`git push -f`) işlemlerini kesinlikle engelle).
   - [x] **Do not allow deletions** (`main` dalının silinmesini engelle).
5. Sayfanın en altındaki **"Create"** (veya **"Save changes"**) butonuna tıklayın ve GitHub şifrenizi/2FA kodunuzu onaylayın.

---

## 3. Doğrulama Senaryosu

Kurallar uygulandıktan sonra terminalden `main` dalına doğrudan commit atıp push yapmayı denediğinizde GitHub şu hatayı döndürmelidir:

```bash
$ git push origin main
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: At least 1 approving review is required by reviewers with write access.
remote: error: Changes must be made through a pull request.
To https://github.com/MeterrGT/gym-churn-scrollytelling.git
 ! [remote rejected] main -> main (protected branch hook declined)
error: failed to push some refs to 'https://github.com/MeterrGT/gym-churn-scrollytelling.git'
```
Bu hata mesajının görülmesi, dal korumasının başarıyla devrede olduğunu kanıtlar.
