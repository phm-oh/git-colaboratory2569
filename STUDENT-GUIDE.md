# คู่มือนักเรียน — โปรเจ็คแนะนำตัว (Git Collaborative)

Repository เดียวกันทั้งห้อง: **https://github.com/phm-oh/git-colaboratory2569**

นักเรียนทุกคนใช้ **repo เดียวกัน** ไม่ต้อง Fork แยก repo ของตัวเอง

---

## สิ่งที่ต้องเตรียม

1. ติดตั้ง **Git** → https://git-scm.com/downloads  
2. สมัคร **GitHub account** → https://github.com/signup  
3. แจ้ง **GitHub username** ให้ครู เพื่อเพิ่มสิทธิ์ Collaborator  
4. รู้ **หมายเลขของตัวเอง** จากหน้าเว็บ (student1 – student18)

---

## ขั้นตอนที่ 1: ตั้งค่า User บนเครื่อง (ทำครั้งเดียว)

Git ต้องรู้ว่า **ใคร** เป็นคน commit งาน ให้ตั้งชื่อและอีเมลของตัวเอง

เปิด **PowerShell** หรือ **Git Bash** แล้วรัน (เปลี่ยนชื่อและอีเมลเป็นของตัวเอง):

```bash
git config --global user.name "นายชินดนัย ธัญญภู"
git config --global user.email "your-email@example.com"
```

> ใช้อีเมลที่ผูกกับ GitHub account ของตัวเอง

ตรวจสอบว่าตั้งค่าถูกต้อง:

```bash
git config --global user.name
git config --global user.email
```

---

## ขั้นตอนที่ 2: Clone Repository (ครั้งแรกเท่านั้น)

```bash
cd Desktop
git clone https://github.com/phm-oh/git-colaboratory2569.git
cd git-colaboratory2569
```

---

## ขั้นตอนที่ 3: ตรวจสอบ Origin

**Origin** คือที่อยู่ของ repository บน GitHub ที่เครื่องเราจะ push/pull ไปหา

หลัง clone แล้ว ตรวจสอบด้วย:

```bash
git remote -v
```

ผลลัพธ์ที่ถูกต้อง:

```
origin  https://github.com/phm-oh/git-colaboratory2569.git (fetch)
origin  https://github.com/phm-oh/git-colaboratory2569.git (push)
```

| คำสั่ง | ความหมาย |
|--------|----------|
| `origin` | ชื่อ remote หลัก (repo กลางของห้อง) |
| `(fetch)` | ดึงโค้ดจาก GitHub มาเครื่อง (`git pull`) |
| `(push)` | ส่งโค้ดจากเครื่องขึ้น GitHub (`git push`) |

ถ้า origin ไม่ถูกต้อง ให้ตั้งใหม่:

```bash
git remote remove origin
git remote add origin https://github.com/phm-oh/git-colaboratory2569.git
git remote -v
```

---

## ขั้นตอนที่ 4: สร้าง Branch ของตัวเอง

ทุกคนสร้าง branch แยกของตัวเอง แต่ push ไป **repo เดียวกัน**

รูปแบบชื่อ branch:

```
student/หมายเลข-ชื่อเล่น
```

**ตัวอย่าง** นักเรียนคนที่ 1:

```bash
git checkout -b student/01-chindanai
```

ตรวจสอบ branch ปัจจุบัน:

```bash
git branch
```

---

## ขั้นตอนที่ 5: Pull โค้ดล่าสุดก่อนทำงาน (ทุกครั้ง)

แม้ใช้ repo เดียวกัน ก็ต้อง **pull** เพื่อดึงโค้ดล่าสุดจากเพื่อนและครู

```bash
git checkout main
git pull origin main
git checkout student/01-chindanai
git merge main
```

> `git pull origin main` = ดึงจาก **origin** (repo กลาง) branch **main**

---

## ขั้นตอนที่ 6: สร้างไฟล์หน้าแนะนำตัว

สร้างไฟล์ในโฟลเดอร์ `students/` ตามหมายเลขของตัวเองเท่านั้น:

```
students/
├── student01.html    ← เปลี่ยนเลขตามหมายเลขตัวเอง
├── student01.css
└── student01.js
```

**ตัวอย่าง** นักเรียนคนที่ 15 สร้าง:

- `students/student15.html`
- `students/student15.css`
- `students/student15.js`

---

## ขั้นตอนที่ 7: Commit และ Push ขึ้น Origin

```bash
git status
git add students/student15.html students/student15.css students/student15.js
git commit -m "เพิ่มหน้าแนะนำตัว student15"
git push -u origin student/15-nattakorn
```

| คำสั่ง | ความหมาย |
|--------|----------|
| `git add` | เลือกไฟล์ที่จะบันทึก |
| `git commit` | บันทึกการเปลี่ยนแปลง |
| `git push origin ...` | ส่ง branch ขึ้น **origin** (repo กลางบน GitHub) |
| `-u origin` | ผูก branch กับ origin (ใช้ครั้งแรกเท่านั้น) |

ครั้งถัดไป push branch เดิม:

```bash
git push
```

---

## ขั้นตอนที่ 8: ส่ง Pull Request (แนะนำ)

1. เปิด https://github.com/phm-oh/git-colaboratory2569  
2. กด **Compare & pull request**  
3. ตั้งหัวข้อ เช่น `เพิ่มหน้าแนะนำตัว student15`  
4. กด **Create pull request**  
5. รอครู merge เข้า `main`

> **Pull Request** ≠ **git pull**  
> - `git pull` = ดึงโค้ดลงเครื่อง  
> - Pull Request = ขอให้ครูรวม branch เข้า main

---

## สรุปคำสั่งทั้งหมด (Copy ได้เลย)

```bash
# === ตั้งค่า user (ครั้งเดียว) ===
git config --global user.name "ชื่อ-นามสกุลของตัวเอง"
git config --global user.email "อีเมลที่ใช้กับ GitHub"

# === Clone (ครั้งแรก) ===
git clone https://github.com/phm-oh/git-colaboratory2569.git
cd git-colaboratory2569

# === ตรวจ origin ===
git remote -v

# === สร้าง branch (เปลี่ยนเลขและชื่อให้ตรงตัวเอง) ===
git checkout -b student/15-nattakorn

# === Pull ก่อนทำงาน (ทุกครั้ง) ===
git checkout main
git pull origin main
git checkout student/15-nattakorn
git merge main

# === ทำงาน + push ===
git add students/student15.html students/student15.css students/student15.js
git commit -m "เพิ่มหน้าแนะนำตัว student15"
git push -u origin student/15-nattakorn
```

---

## วันถัดไปที่มาทำต่อ

```bash
cd git-colaboratory2569
git checkout main
git pull origin main
git checkout student/15-nattakorn
git merge main

# แก้ไฟล์ต่อ...
git add .
git commit -m "อัปเดตหน้าแนะนำตัว"
git push
```

---

## ตารางหมายเลขนักเรียน

| หมายเลข | ชื่อ | ตัวอย่าง branch | ไฟล์ที่สร้าง |
|--------|------|----------------|-------------|
| 1 | นายชินดนัย ธัญญภู | `student/01-chindanai` | `student1.*` |
| 2 | นายนันทสิทธิ์ จินดา | `student/02-nanthasit` | `student2.*` |
| 3 | นายปฏิภาณ พรหมแสนปัง | `student/03-patiphan` | `student3.*` |
| 4 | นายกมลเทพ โสภา | `student/04-kamontep` | `student4.*` |
| 5 | นายติณณ์ภัทร เกาะแก้ว | `student/05-tinnaphat` | `student5.*` |
| 6 | นายธีรยุทธ สุดเต้ | `student/06-theerayut` | `student6.*` |
| 7 | นายวรินทร หมื่นสุข | `student/07-warinthorn` | `student7.*` |
| 8 | นายศิวัฒน์ คำแก้ว | `student/08-siwat` | `student8.*` |
| 9 | นางสาวกนกพิชญ์ ไชยสีดา | `student/09-kanokpich` | `student9.*` |
| 10 | นางสาวกันนิชา ศาลาคำ | `student/10-kannicha` | `student10.*` |
| 11 | นางสาวพรวิภา โททวง | `student/11-pornwipa` | `student11.*` |
| 12 | นางสาวรัตน์วรา สงนำมา | `student/12-rattanwara` | `student12.*` |
| 13 | นางสาวสุนิษา บุญหมั่น | `student/13-sunisa` | `student13.*` |
| 14 | นางสาวอริยาภรณ์ อุดมฤทธิ์ | `student/14-ariyaporn` | `student14.*` |
| 15 | นายณัฐกรณ์ อุเทนหลอย | `student/15-nattakorn` | `student15.*` |
| 16 | นายชัยวัฒน์ ชนะบุญ | `student/16-chaiwat` | `student16.*` |
| 17 | นายศิวปรีชา นิคม | `student/17-siwprecha` | `student17.*` |
| 18 | นายจักรภพ ตรีรัตน์ | `student/18-jakkrapop` | `student18.*` |

---

## ข้อควรระวัง

| ห้าม | ควร |
|-----|-----|
| แก้ไฟล์ของเพื่อน | แก้เฉพาะไฟล์ `studentX` ของตัวเอง |
| Push ตรงเข้า `main` โดยไม่แจ้งครู | Push ไป branch ของตัวเอง แล้วส่ง Pull Request |
| ลืม pull ก่อนเริ่มงาน | `git pull origin main` ทุกครั้งก่อนทำงาน |
| ใช้ user/email ของคนอื่น | ตั้ง `git config user.name` และ `user.email` ของตัวเอง |

---

## แก้ปัญหาเบื้องต้น

### Push ไม่ได้ / Authentication failed

1. ตรวจว่าครูเพิ่มสิทธิ์ Collaborator แล้ว  
2. Login GitHub บนเครื่อง:
   ```bash
   gh auth login
   ```
   หรือใช้ **GitHub Desktop** / **Personal Access Token**

### Origin ไม่ถูกต้อง

```bash
git remote -v
git remote set-url origin https://github.com/phm-oh/git-colaboratory2569.git
```

### มี Conflict ตอน merge

```bash
git status
# แก้ไฟล์ที่ conflict แล้ว
git add .
git commit -m "แก้ conflict"
git push
```

---

## ติดต่อ

- ครูผู้สอน: **ครูภาณุเมศ ชุมภูนท์**
- Repository: https://github.com/phm-oh/git-colaboratory2569
