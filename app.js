let profileData = {};

function createParticles() {
    const container = document.querySelector('.floating-particles');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 10 + 5) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        container.appendChild(particle);
    }
}

function switchTab(tabName) {
    const currentActive = document.querySelector('.tab-content.active');
    const newTabContent = document.getElementById(tabName + '-tab');

    if (newTabContent.classList.contains('active')) return;

    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    event.target.classList.add('active');

    if (currentActive) {
        currentActive.style.opacity = 0;
        setTimeout(() => {
            currentActive.classList.remove('active');

            newTabContent.classList.add('active');
            newTabContent.style.opacity = 0;
            setTimeout(() => {
                newTabContent.style.opacity = 1;
            }, 50);

         
            if (tabName === 'export') {
                updateExportPreview();
            }
        }, 300);
    } else {
       
        newTabContent.classList.add('active');
        newTabContent.style.opacity = 1;
        if (tabName === 'export') {
            updateExportPreview();
        }
    }
}


function saveProfile() {
    const form = document.getElementById('profileForm');
    const formData = new FormData(form);
    
    const requiredFields = ['firstName', 'lastName', 'email'];
    let isValid = true;
    
    for (let field of requiredFields) {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            showStatus('Please fill in all required fields (marked with *)', 'error');
            isValid = false;
            break;
        }
    }
    
    if (!isValid) return;
    
    profileData = {};
    for (let [key, value] of formData.entries()) {
        profileData[key] = value;
    }
    
    updateProfileSummary();
    updateExportPreview();
    showStatus('Profile saved successfully! 🎉', 'success');
}

function clearProfile() {
    if (confirm('Are you sure you want to clear your saved profile?')) {
        profileData = {};
        document.getElementById('profileForm').reset();
        updateProfileSummary();
        updateExportPreview();
        showStatus('Profile cleared successfully', 'success');
    }
}

function updateProfileSummary() {
    const summaryDiv = document.getElementById('profileSummary');
    
    if (Object.keys(profileData).length === 0) {
        summaryDiv.innerHTML = '<p style="text-align: center; color: #718096; font-style: italic;">No profile saved yet. Fill out the form and click "Save Profile" to get started.</p>';
        return;
    }
    
    let html = '<h3 style="color: #4a5568; margin-bottom: 15px;">📋 Your Saved Information</h3>';
    
    const fieldLabels = {
        firstName: '👤 First Name',
        lastName: '👤 Last Name',
        email: '📧 Email',
        phone: '📞 Phone',
        address: '🏠 Address',
        city: '🏙️ City',
        zipCode: '📮 ZIP Code',
        company: '🏢 Company',
        jobTitle: '💼 Job Title'
    };
    
    for (let [key, value] of Object.entries(profileData)) {
        if (value && value.trim()) {
            html += `<div class="profile-item"><strong>${fieldLabels[key] || key}:</strong> ${value}</div>`;
        }
    }
    
    summaryDiv.innerHTML = html;
}

function updateExportPreview() {
    const previewDiv = document.getElementById('exportPreview');
    
    if (Object.keys(profileData).length === 0) {
        previewDiv.innerHTML = '<p style="text-align: center; color: #718096; font-style: italic;">Save your profile first to see the export preview</p>';
        return;
    }
    
    let html = '<h3 style="color: #4a5568; margin-bottom: 15px;">📄 PDF Export Preview</h3>';
    
    const fieldLabels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        address: 'Address',
        city: 'City',
        zipCode: 'ZIP Code',
        company: 'Company/Organization',
        jobTitle: 'Job Title/Position'
    };
    
    for (let [key, value] of Object.entries(profileData)) {
        if (value && value.trim()) {
            html += `<div class="profile-item"><strong>${fieldLabels[key]}:</strong> ${value}</div>`;
        }
    }
    
    previewDiv.innerHTML = html;
}

function autoFillForm(formId) {
    if (Object.keys(profileData).length === 0) {
        showStatus('Please save your profile first before using auto-fill', 'error');
        return;
    }
    
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('.autofill-target');
    
    let filledCount = 0;
    
    inputs.forEach(input => {
        const fieldName = input.getAttribute('name');
        if (profileData[fieldName] && profileData[fieldName].trim()) {
            input.value = profileData[fieldName];
            input.style.background = '#c6f6d5';
            filledCount++;
            
            setTimeout(() => {
                input.style.background = '';
            }, 2000);
        }
    });
    
    if (filledCount > 0) {
        showStatus(`Auto-filled ${filledCount} fields successfully! ✨`, 'success');
    } else {
        showStatus('No matching fields found to auto-fill', 'error');
    }
}

function clearForm(formId) {
    document.getElementById(formId).reset();
    showStatus('Form cleared', 'success');
}

function exportToPDF() {
    if (Object.keys(profileData).length === 0) {
        showStatus('Please save your profile first before exporting', 'error');
        return;
    }
    
    const loading = document.getElementById('loadingExport');
    loading.style.display = 'block';
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(24);
            doc.setTextColor(102, 126, 234);
            doc.text('QuickForm Profile Export', 20, 30);
            
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
            
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('Personal Information', 20, 60);
            
            let y = 75;
            const fieldLabels = {
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email Address',
                phone: 'Phone Number',
                address: 'Address',
                city: 'City',
                zipCode: 'ZIP Code',
                company: 'Company/Organization',
                jobTitle: 'Job Title/Position'
            };
            
            doc.setFontSize(12);
            
            for (let [key, value] of Object.entries(profileData)) {
                if (value && value.trim()) {
                    doc.setFont(undefined, 'bold');
                    doc.text(`${fieldLabels[key]}:`, 20, y);
                    doc.setFont(undefined, 'normal');
                    
                    const lines = doc.splitTextToSize(value, 120);
                    doc.text(lines, 70, y);
                    y += lines.length * 7 + 5;
                }
            }
            
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text('Generated by QuickForm - Smart Autofill & Export Tool', 20, 280);
            
            const fileName = `${profileData.firstName || 'Profile'}_${profileData.lastName || 'Export'}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            loading.style.display = 'none';
            showStatus('PDF downloaded successfully! 📄', 'success');
        } catch (error) {
            loading.style.display = 'none';
            showStatus('Error generating PDF. Please try again.', 'error');
            console.error('PDF generation error:', error);
        }
    }, 1000);
}

function printProfile() {
    if (Object.keys(profileData).length === 0) {
        showStatus('Please save your profile first before printing', 'error');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    const fieldLabels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        address: 'Address',
        city: 'City',
        zipCode: 'ZIP Code',
        company: 'Company/Organization',
        jobTitle: 'Job Title/Position'
    };
    
    let printContent = `
        <html>
        <head>
            <title>QuickForm Profile</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
                .header { text-align: center; margin-bottom: 40px; }
                .header h1 { color: #667eea; margin-bottom: 10px; }
                .info-section { margin-bottom: 30px; }
                .info-item { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-left: 4px solid #667eea; }
                .label { font-weight: bold; color: #4a5568; }
                .value { margin-top: 5px; }
                .footer { text-align: center; margin-top: 50px; color: #718096; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>QuickForm Profile</h1>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="info-section">
                <h2>Personal Information</h2>
    `;
    
    for (let [key, value] of Object.entries(profileData)) {
        if (value && value.trim()) {
            printContent += `
                <div class="info-item">
                    <div class="label">${fieldLabels[key]}:</div>
                    <div class="value">${value}</div>
                </div>
            `;
        }
    }
    
    printContent += `
            </div>
            <div class="footer">
                Generated by QuickForm - Smart Autofill & Export Tool
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    showStatus('Print dialog opened successfully! 🖨️', 'success');
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message status-${type} show`;
    
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 4000);
}

function loadSavedProfile() {
    updateProfileSummary();
    updateExportPreview();
}

let autoSaveTimeout;
function setupAutoSave() {
    const profileForm = document.getElementById('profileForm');
    const inputs = profileForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                if (Object.keys(profileData).length > 0) {
                    const formData = new FormData(profileForm);
                    for (let [key, value] of formData.entries()) {
                        if (value.trim()) {
                            profileData[key] = value;
                        }
                    }
                    updateProfileSummary();
                    updateExportPreview();
                }
            }, 1000);
        });
    });
}

function setupSmoothInteractions() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.style.transform = 'scale(1)';
        });
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveProfile();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportToPDF();
        }

        if (e.key === 'F1') {
            e.preventDefault();
            switchTab('profile');
        }
        if (e.key === 'F2') {
            e.preventDefault();
            switchTab('demo');
        }
        if (e.key === 'F3') {
            e.preventDefault();
            switchTab('export');
        }
    });
}

function setupFormValidation() {
    const requiredInputs = document.querySelectorAll('input[required]');
    
    requiredInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.style.borderColor = '#e53e3e';
                input.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
            } else {
                input.style.borderColor = '#48bb78';
                input.style.boxShadow = '0 0 0 3px rgba(72, 187, 120, 0.1)';
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.style.borderColor = '#48bb78';
                input.style.boxShadow = '0 0 0 3px rgba(72, 187, 120, 0.1)';
            }
        });
    });
}

function setupTooltips() {
    const tooltipData = {
        'firstName': 'Enter your legal first name as it appears on official documents',
        'lastName': 'Enter your legal last name as it appears on official documents',
        'email': 'Use a professional email address that you check regularly',
        'phone': 'Include area code. Format: (123) 456-7890',
        'address': 'Enter your complete mailing address',
        'city': 'Enter the city where you currently reside',
        'zipCode': 'Enter your postal/ZIP code',
        'company': 'Current or most recent employer/organization',
        'jobTitle': 'Your current or most recent job title/position'
    };
    
    Object.entries(tooltipData).forEach(([fieldName, tooltip]) => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.setAttribute('title', tooltip);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadSavedProfile();
    setupAutoSave();
    setupSmoothInteractions();
    setupKeyboardShortcuts();
    setupFormValidation();
    setupTooltips();
    
    setTimeout(() => {
        showStatus('Welcome to QuickForm! Start by filling out your profile. 👋', 'success');
    }, 1000);
});

let clickCount = 0;
document.querySelector('.header h1').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showStatus('🎉 You found the Easter egg! QuickForm loves power users!', 'success');
        clickCount = 0;
    }
});

if ('serviceWorker' in navigator) {
    console.log('Service Worker support detected');
}

window.addEventListener('popstate', (e) => {
    if (e.state && e.state.tab) {
        switchTab(e.state.tab);
    }
});

function exportToJSON() {
    if (Object.keys(profileData).length === 0) {
        showStatus('Please save your profile first before exporting', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `quickform_profile_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showStatus('JSON file downloaded successfully! 📦', 'success');
}

function importFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    const validFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'company', 'jobTitle'];
                    const filteredData = {};
                    
                    for (let field of validFields) {
                        if (importedData[field]) {
                            filteredData[field] = importedData[field];
                        }
                    }
                    
                    profileData = filteredData;
  
                    const form = document.getElementById('profileForm');
                    Object.entries(profileData).forEach(([key, value]) => {
                        const field = form.querySelector(`[name="${key}"]`);
                        if (field) {
                            field.value = value;
                        }
                    });
                    
                    updateProfileSummary();
                    updateExportPreview();
                    showStatus('Profile imported successfully! 📥', 'success');
                } catch (error) {
                    showStatus('Invalid JSON file. Please check the format.', 'error');
                }
            };
            reader.readAsText(file);
        }
    });
    
    input.click();
}