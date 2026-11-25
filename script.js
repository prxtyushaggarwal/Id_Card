let maxUnlockedStep = 1;
let currentPortalStep = 1;

let appData = {
  regNo: '12204589',
  fullName: 'Rahul Sharma',
  branch: 'School of Computer Science & Engineering (B.Tech CSE)',
  bloodGroup: 'B+',
  email: 'rahul.12204589@lpu.in',
  phone: '9876543210',
  reason: 'Lost',
  processingSpeed: 'standard',
  hasLanyard: false,
  hasSlip: false,
  totalFee: 300,
  uploadedDoc: null,
  trackingStage: 3
};

const reasonChecklists = {
  Lost: [
    { text: 'Police Lost Article Report (LAR) Acknowledgment Slip', mandatory: true },
    { text: 'Student Undertaking Declaration for Missing ID', mandatory: true },
    { text: 'Secondary ID Proof (Aadhaar / UMS Profile Screenshot)', mandatory: false }
  ],
  Damaged: [
    { text: 'Physical Card Surrender Declaration at Block 32 DSW Counter', mandatory: true },
    { text: 'Clear photograph of damaged plastic card (front & back)', mandatory: true }
  ],
  Defaced: [
    { text: 'Photo of defaced card showing faded details or unreadable barcode', mandatory: true },
    { text: 'Updated passport size student photograph for thermal re-print', mandatory: true }
  ]
};

const campusStages = [
  { name: 'Application & Reason Submitted', place: 'Online UMS Portal' },
  { name: 'Police Report & Checklist Cleared', place: 'Security & Proctor Office (Block 29)' },
  { name: 'Smart Card Encoding & Thermal Printing', place: 'Central Card Section (Block 30, Room 102)' },
  { name: 'Dispatched via Intra-Campus Courier', place: 'Transit to Uni-Mall / Block 32' },
  { name: 'Ready for Student Collection', place: 'Division of Student Welfare (Block 32)' }
];

document.addEventListener('DOMContentLoaded', () => {
  setupFileUpload();
  renderChecklistItems();
});

function openContactModal() {
  const modal = document.getElementById('dswContactModal');
  if (modal) modal.classList.add('open');
}

function closeContactModal() {
  const modal = document.getElementById('dswContactModal');
  if (modal) modal.classList.remove('open');
}

function closeContactModalOutside(e) {
  if (e.target.id === 'dswContactModal') {
    closeContactModal();
  }
}

function showLandingPage() {
  document.getElementById('portalView').style.display = 'none';
  document.getElementById('landingView').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openPortalAtStep(stepNum) {
  document.getElementById('landingView').style.display = 'none';
  document.getElementById('portalView').style.display = 'block';

  if (stepNum > maxUnlockedStep) {
    switchStep(maxUnlockedStep);
  } else {
    switchStep(stepNum);
  }
}

function openPortalWithReason(reason) {
  openPortalAtStep(1);
  const radio = document.querySelector(`input[name="reissueCategory"][value="${reason}"]`);
  if (radio) {
    radio.checked = true;
    handleReasonChange();
  }
}

function navigateToStepIfAllowed(targetStep) {
  if (targetStep <= maxUnlockedStep) {
    switchStep(targetStep);
  } else {
    alert('Please complete the current step verification first to unlock Step ' + targetStep);
  }
}

function switchStep(targetStep) {
  currentPortalStep = targetStep;

  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById(`panelStep${i}`);
    if (panel) {
      panel.style.display = (i === targetStep) ? 'block' : 'none';
    }
  }

  for (let s = 1; s <= 4; s++) {
    const pill = document.getElementById(`pillStep${s}`);
    if (pill) {
      pill.classList.remove('active', 'completed');
      if (s === targetStep) {
        pill.classList.add('active');
      } else if (s < targetStep || s <= maxUnlockedStep) {
        pill.classList.add('completed');
      }
    }
  }

  for (let c = 1; c <= 3; c++) {
    const conn = document.getElementById(`conn${c}`);
    if (conn) {
      if (c < targetStep || c < maxUnlockedStep) {
        conn.classList.add('filled');
      } else {
        conn.classList.remove('filled');
      }
    }
  }

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function handleReasonChange() {
  const checked = document.querySelector('input[name="reissueCategory"]:checked');
  if (checked) {
    appData.reason = checked.value;
    renderChecklistItems();
  }
}

function validateField(inputEl, regex, errId) {
  const val = inputEl.value.trim();
  const valid = regex.test(val);
  const errEl = document.getElementById(errId);

  if (!valid) {
    inputEl.classList.add('err-border');
    errEl.classList.add('show');
    return false;
  } else {
    inputEl.classList.remove('err-border');
    errEl.classList.remove('show');
    return true;
  }
}

function submitStep1() {
  const regEl = document.getElementById('regNo');
  const nameEl = document.getElementById('fullName');
  const branchEl = document.getElementById('branch');
  const bloodEl = document.getElementById('bloodGroup');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  const undertakingEl = document.getElementById('studentUndertaking');

  const vReg = validateField(regEl, /^[0-9]{8}$/, 'errRegNo');
  const vName = validateField(nameEl, /^[a-zA-Z\s.]{3,50}$/, 'errName');
  const vEmail = validateField(emailEl, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'errEmail');
  const vPhone = validateField(phoneEl, /^[6-9][0-9]{9}$/, 'errPhone');

  let vBranch = true;
  if (!branchEl.value) {
    branchEl.classList.add('err-border');
    document.getElementById('errBranch').classList.add('show');
    vBranch = false;
  } else {
    branchEl.classList.remove('err-border');
    document.getElementById('errBranch').classList.remove('show');
  }

  let vBlood = true;
  if (!bloodEl.value) {
    bloodEl.classList.add('err-border');
    document.getElementById('errBlood').classList.add('show');
    vBlood = false;
  } else {
    bloodEl.classList.remove('err-border');
    document.getElementById('errBlood').classList.remove('show');
  }

  let vUndertaking = true;
  if (!undertakingEl.checked) {
    document.getElementById('errUndertaking').classList.add('show');
    vUndertaking = false;
  } else {
    document.getElementById('errUndertaking').classList.remove('show');
  }

  if (vReg && vName && vBranch && vBlood && vEmail && vPhone && vUndertaking) {
    appData.regNo = regEl.value.trim();
    appData.fullName = nameEl.value.trim();
    appData.branch = branchEl.value;
    appData.bloodGroup = bloodEl.value;
    appData.email = emailEl.value.trim();
    appData.phone = phoneEl.value.trim();
    appData.reason = document.querySelector('input[name="reissueCategory"]:checked').value;

    if (maxUnlockedStep < 2) maxUnlockedStep = 2;
    renderChecklistItems();
    switchStep(2);
  }
}

function resetFormStep1() {
  document.getElementById('reissueForm').reset();
  document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.err-border').forEach(e => e.classList.remove('err-border'));
}

function renderChecklistItems() {
  const reason = appData.reason || 'Lost';
  const reasonBadge = document.getElementById('lblActiveReason');
  if (reasonBadge) reasonBadge.textContent = reason;

  const noticeHead = document.getElementById('noticeHeading');
  const noticePara = document.getElementById('noticeParagraph');

  if (noticeHead && noticePara) {
    if (reason === 'Lost') {
      noticeHead.textContent = 'Police Missing / Lost Report Requirement';
      noticePara.textContent = 'As per LPU Security guidelines, students applying under Lost category must upload a valid Police Diary / Lost Article Report (LAR) acknowledgment slip or Online Missing Complaint receipt.';
    } else if (reason === 'Damaged') {
      noticeHead.textContent = 'Physical Damaged Card Surrender Requirement';
      noticePara.textContent = 'Students must upload photo of damaged card and surrender physical card at Block 32 counter during collection.';
    } else {
      noticeHead.textContent = 'Defaced Card & Photo Verification Requirement';
      noticePara.textContent = 'Upload photo of defaced/unreadable card or a fresh formal passport photo for high-resolution thermal re-printing.';
    }
  }

  const container = document.getElementById('chkListContainer');
  if (!container) return;
  container.innerHTML = '';

  const list = reasonChecklists[reason] || reasonChecklists['Lost'];
  list.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'chk-line';
    row.innerHTML = `
      <div class="chk-left-wrap">
        <input type="checkbox" id="chkDoc_${idx}" class="chk-item-input" onchange="evaluateStep2Completion()">
        <label for="chkDoc_${idx}">${item.text} ${item.mandatory ? '<span class="req">*</span>' : ''}</label>
      </div>
      <span class="badge-tag-status pending" id="statusPill_${idx}">Pending</span>
    `;
    container.appendChild(row);
  });

  evaluateStep2Completion();
}

function setupFileUpload() {
  const fileInput = document.getElementById('supportDocInput');
  const dropBox = document.getElementById('dropZoneBox');

  if (!fileInput || !dropBox) return;

  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      handleDocFile(this.files[0]);
    }
  });

  dropBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropBox.style.borderColor = '#EA580C';
  });

  dropBox.addEventListener('dragleave', () => {
    dropBox.style.borderColor = '#CBD5E1';
  });

  dropBox.addEventListener('drop', (e) => {
    e.preventDefault();
    dropBox.style.borderColor = '#CBD5E1';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDocFile(e.dataTransfer.files[0]);
    }
  });
}

function handleDocFile(file) {
  if (file.size > 2 * 1024 * 1024) {
    alert('File size exceeds 2MB limit. Please upload a smaller document.');
    return;
  }

  appData.uploadedDoc = file;

  const card = document.getElementById('uploadedDocCard');
  document.getElementById('uFileName').textContent = file.name;
  document.getElementById('uFileSize').textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  card.style.display = 'flex';

  const firstChk = document.getElementById('chkDoc_0');
  if (firstChk) {
    firstChk.checked = true;
  }

  evaluateStep2Completion();
}

function evaluateStep2Completion() {
  const inputs = document.querySelectorAll('.chk-item-input');
  inputs.forEach((input, idx) => {
    const pill = document.getElementById(`statusPill_${idx}`);
    if (pill) {
      if (input.checked) {
        pill.className = 'badge-tag-status ok';
        pill.textContent = 'Verified ✔';
      } else {
        pill.className = 'badge-tag-status pending';
        pill.textContent = 'Pending';
      }
    }
  });

  const hasUploaded = appData.uploadedDoc !== null;
  const firstChecked = document.getElementById('chkDoc_0') && document.getElementById('chkDoc_0').checked;

  const btn = document.getElementById('btnStep2Submit');
  const clearanceBox = document.getElementById('clearanceBox');
  const clearanceTitle = document.getElementById('clearanceTitle');
  const clearanceDesc = document.getElementById('clearanceDesc');
  const clearanceCircle = document.getElementById('clearanceCircle');

  if (hasUploaded && firstChecked) {
    btn.disabled = false;
    clearanceBox.classList.add('approved');
    clearanceCircle.innerHTML = '<i class="fa-solid fa-check"></i>';
    clearanceTitle.textContent = 'Verification Status: Cleared for Reissue';
    clearanceTitle.style.color = '#16A34A';
    clearanceDesc.textContent = 'Mandatory security checks passed. You can now calculate reissue fee and complete settlement.';
  } else {
    btn.disabled = true;
    clearanceBox.classList.remove('approved');
    clearanceCircle.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i>';
    clearanceTitle.textContent = 'Verification Status: Pending Documents';
    clearanceTitle.style.color = '#0F172A';
    clearanceDesc.textContent = 'Please upload your supporting document and acknowledge the mandatory checklist items above.';
  }
}

function submitStep2() {
  if (maxUnlockedStep < 3) maxUnlockedStep = 3;
  prepareStep3();
  switchStep(3);
}

function prepareStep3() {
  document.getElementById('bRegNo').textContent = appData.regNo || '12204589';
  document.getElementById('bName').textContent = appData.fullName || 'Rahul Sharma';
  document.getElementById('bReason').textContent = appData.reason || 'Lost';
  recalculateBill();
}

function recalculateBill() {
  const isUrgent = document.querySelector('input[name="procSpeed"]:checked').value === 'urgent';
  appData.processingSpeed = isUrgent ? 'urgent' : 'standard';

  const basePrice = isUrgent ? 600 : 300;
  document.getElementById('bProcLabel').textContent = isUrgent ? 'Urgent 24-Hour Express Processing' : 'Standard Batch Processing';
  document.getElementById('bProcPrice').textContent = '₹' + basePrice + '.00';

  const chkLanyard = document.getElementById('chkLanyard').checked;
  const chkSlip = document.getElementById('chkGateSlip').checked;

  appData.hasLanyard = chkLanyard;
  appData.hasSlip = chkSlip;

  document.getElementById('bLanyardRow').style.display = chkLanyard ? 'flex' : 'none';
  document.getElementById('bSlipRow').style.display = chkSlip ? 'flex' : 'none';

  let total = basePrice;
  if (chkLanyard) total += 50;
  if (chkSlip) total += 40;

  appData.totalFee = total;
  document.getElementById('bTotal').textContent = '₹' + total + '.00';
  document.getElementById('bPayVal').textContent = total;
}

function changePaymentTab(method) {
  document.querySelectorAll('.pay-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('contentUPI').style.display = (method === 'UPI') ? 'block' : 'none';
  document.getElementById('contentCard').style.display = (method === 'Card') ? 'block' : 'none';
  document.getElementById('contentUMS').style.display = (method === 'UMS') ? 'block' : 'none';

  if (method === 'UPI') document.getElementById('tabUPI').classList.add('active');
  if (method === 'Card') document.getElementById('tabCard').classList.add('active');
  if (method === 'UMS') document.getElementById('tabUMS').classList.add('active');
}

function processPayment() {
  const btn = document.getElementById('btnPayAction');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Secure Payment...';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-lock"></i> Pay & Authorize Reissue (₹${appData.totalFee})`;
    alert(`Payment of ₹${appData.totalFee} Successful!\nTransaction ID: TXN-LPU-${Math.floor(100000 + Math.random() * 900000)}\nAuthorization granted for central card printing.`);

    if (maxUnlockedStep < 4) maxUnlockedStep = 4;
    setupStep4();
    switchStep(4);
  }, 1000);
}

function setupStep4() {
  document.getElementById('tRefId').textContent = 'LPU-ID-2026-' + (appData.regNo ? appData.regNo.slice(-5) : '04589');
  
  const isUrgent = appData.processingSpeed === 'urgent';
  document.getElementById('tEstimated').textContent = isUrgent ? 'Within 24 Hours (Express Print)' : '3 to 5 Working Days (Standard)';

  document.getElementById('idCardName').textContent = (appData.fullName || 'RAHUL SHARMA').toUpperCase();
  document.getElementById('idCardReg').textContent = appData.regNo || '12204589';
  document.getElementById('idCardBranch').textContent = appData.branch || 'School of Computer Science & Engineering (B.Tech CSE)';
  document.getElementById('idCardBlood').textContent = appData.bloodGroup || 'B+';

  appData.trackingStage = 3;
  renderTrackingTimeline();
}

function simulateNextStage() {
  if (appData.trackingStage < 5) {
    appData.trackingStage++;
    renderTrackingTimeline();
  } else {
    alert('Your ID Card is ready for collection at Block 32 Counter 4!');
  }
}

function renderTrackingTimeline() {
  const current = appData.trackingStage;
  const stageData = campusStages[current - 1];

  document.getElementById('tStatus').textContent = stageData.name;
  document.getElementById('tLocation').textContent = stageData.place;

  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`stageNode${i}`);
    const timeSpan = document.getElementById(`tTime${i}`);

    if (node) {
      node.className = 'tree-node';
      const bullet = node.querySelector('.tree-bullet');

      if (i < current) {
        node.classList.add('completed');
        bullet.innerHTML = '<i class="fa-solid fa-check"></i>';
        if (timeSpan && timeSpan.textContent === 'Pending') timeSpan.textContent = 'Done ✔';
      } else if (i === current) {
        node.classList.add('active');
        bullet.innerHTML = (i === 3) ? '<i class="fa-solid fa-print"></i>' : (i === 4 ? '<i class="fa-solid fa-van-shuttle"></i>' : '<i class="fa-solid fa-box-open"></i>');
        if (timeSpan) {
          timeSpan.textContent = 'Active Now';
          timeSpan.classList.add('active-time');
        }
      } else {
        node.classList.add('pending');
        bullet.innerHTML = (i === 4) ? '<i class="fa-solid fa-van-shuttle"></i>' : '<i class="fa-solid fa-box-open"></i>';
        if (timeSpan) {
          timeSpan.textContent = 'Pending';
          timeSpan.classList.remove('active-time');
        }
      }
    }
  }
}


let currentUmsUser = null;

const demoStudents = {
  '12204589': {
    fullName: 'Rahul Sharma',
    regNo: '12204589',
    branch: 'School of Computer Science & Engineering (B.Tech CSE)',
    bloodGroup: 'B+',
    email: 'rahul.12204589@lpu.in',
    phone: '9876543210'
  },
  '12119045': {
    fullName: 'Aman Verma',
    regNo: '12119045',
    branch: 'Mittal School of Business (MBA)',
    bloodGroup: 'O+',
    email: 'aman.12119045@lpu.in',
    phone: '9812345678'
  }
};

function openLoginModal() {
  const modal = document.getElementById('lpuLoginModal');
  if (modal) modal.classList.add('open');
}

function closeLoginModal() {
  const modal = document.getElementById('lpuLoginModal');
  if (modal) modal.classList.remove('open');
}

function closeLoginModalOutside(e) {
  if (e.target.id === 'lpuLoginModal') {
    closeLoginModal();
  }
}

function quickFillDemoLogin(regNo) {
  const input = document.getElementById('umsRegInput');
  if (input) input.value = regNo;
}

function submitUmsLogin() {
  const regInput = document.getElementById('umsRegInput');
  const regVal = regInput ? regInput.value.trim() : '12204589';

  let student = demoStudents[regVal];
  if (!student) {
    student = {
      fullName: 'Student ' + regVal,
      regNo: regVal,
      branch: 'School of Computer Science & Engineering (B.Tech CSE)',
      bloodGroup: 'B+',
      email: 'student.' + regVal + '@lpu.in',
      phone: '9876543210'
    };
  }

  currentUmsUser = student;
  appData.fullName = student.fullName;
  appData.regNo = student.regNo;
  appData.branch = student.branch;
  appData.bloodGroup = student.bloodGroup;
  appData.email = student.email;
  appData.phone = student.phone;

  populateStudentFormFields();
  updateNavUserBadge();
  closeLoginModal();

  alert('Successfully signed in to LPU UMS as ' + student.fullName + ' (' + student.regNo + ')!\nYour student records have been pre-filled for ID reissue.');
}

function populateStudentFormFields() {
  if (!currentUmsUser) return;
  const fName = document.getElementById('fullNameInput');
  const rNo = document.getElementById('regNoInput');
  const br = document.getElementById('branchInput');
  const bg = document.getElementById('bloodGrpInput');
  const ph = document.getElementById('mobileInput');
  const em = document.getElementById('emailInput');

  if (fName) fName.value = currentUmsUser.fullName;
  if (rNo) rNo.value = currentUmsUser.regNo;
  if (br) br.value = currentUmsUser.branch;
  if (bg) bg.value = currentUmsUser.bloodGroup;
  if (ph) ph.value = currentUmsUser.phone;
  if (em) em.value = currentUmsUser.email;
}

function updateNavUserBadge() {
  const box = document.getElementById('navAuthBox');
  if (!box) return;

  if (currentUmsUser) {
    box.innerHTML = `
      <div class="user-profile-badge">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" class="user-avatar-mini" alt="User">
        <div class="user-profile-info">
          <span class="user-name">${currentUmsUser.fullName}</span>
          <span class="user-reg">${currentUmsUser.regNo}</span>
        </div>
        <button type="button" class="btn-logout-icon" title="Log Out" onclick="performLogout()">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
      <button type="button" class="quote-btn" onclick="openPortalAtStep(1)">
        APPLY FOR REISSUE
      </button>
    `;
  } else {
    box.innerHTML = `
      <button type="button" class="login-btn" onclick="openLoginModal()" id="btnNavLogin">
        <i class="fa-regular fa-circle-user"></i>
        <span>UMS Log In</span>
      </button>
      <button type="button" class="quote-btn" onclick="openPortalAtStep(1)">
        APPLY FOR REISSUE
      </button>
    `;
  }
}

function performLogout() {
  currentUmsUser = null;
  updateNavUserBadge();
  alert('You have been logged out of LPU UMS.');
}

function handleQuickLookup() {
  const input = document.getElementById('quickLookupInput');
  const regVal = input ? input.value.trim() : '';

  if (regVal) {
    appData.regNo = regVal;
    if (demoStudents[regVal]) {
      appData.fullName = demoStudents[regVal].fullName;
      appData.branch = demoStudents[regVal].branch;
      appData.bloodGroup = demoStudents[regVal].bloodGroup;
    }
  }

  maxUnlockedStep = 4;
  setupStep4();
  openPortalAtStep(4);
}

function toggleFaq(faqElement) {
  faqElement.classList.toggle('open');
}
