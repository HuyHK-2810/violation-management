let studentRecords = [];
const initialPoints = 100;

async function saveRecord() {
    const date = document.getElementById('violationDate').value;
    const selectElement = document.getElementById('studentName');
    const id = selectElement.value;
    const studentName = selectElement.options[selectElement.selectedIndex].textContent;
    // const studentName = document.getElementById('studentName').textContent;
    // const id = document.getElementById('studentName').value;
    let totalDeduction = 0;
    let violations = [];

    document.querySelectorAll('.violation:checked').forEach(checkbox => {
        totalDeduction += parseInt(checkbox.value);
        violations.push(checkbox.parentNode.textContent.trim());
    });

    const remainingPoints = initialPoints - totalDeduction;
    const newRecord = { date, studentName, violations: violations.join(', '), totalDeduction, remainingPoints, id };

    // Gửi dữ liệu mới lên server
    try {
        const response = await fetch('/api/violations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord)
        });

        const result = await response.json();
        if (result.message) {
            console.log(result.message);
            loadData(); // Tải lại dữ liệu sau khi lưu thành công
        } else {
            console.error('Lỗi khi lưu dữ liệu:', result.error);
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
}

// Hàm load dữ liệu từ API
async function loadData() {
    const date = document.getElementById('violationDate').value;
    const selectElement = document.getElementById('studentName');
    const id = selectElement.value;
    const studentName = selectElement.options[selectElement.selectedIndex].textContent;

    if (!date || !id) return;

    try {
        const response = await fetch(`/api/violations?date=${date}&studentName=${id}`);
        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return;
        }

        studentRecords = data;
        updateDailyTable();
        calculateWeeklyTotal();
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }
}

// Hàm cập nhật bảng Daily Record
function updateDailyTable() {
    const dailyTableBody = document.getElementById('dailyTable').querySelector('tbody');
    dailyTableBody.innerHTML = '';

    studentRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.studentName}</td>
            <td>${record.violations}</td>
            <td>${record.totalDeduction}</td>
            <td>${record.remainingPoints}</td>
        `;
        dailyTableBody.appendChild(row);
    });
}

// Hàm tính toán và cập nhật bảng Weekly Summary
function calculateWeeklyTotal() {
    const weeklyTableBody = document.getElementById('weeklyTable').querySelector('tbody');
    weeklyTableBody.innerHTML = '';

    const weeklySummary = studentRecords.reduce((summary, record) => {
        if (!summary[record.id]) {
            summary[record.id] = { totalDeduction: 0, remainingPoints: initialPoints };
        }
        summary[record.id].totalDeduction += record.totalDeduction;
        summary[record.id].remainingPoints -= record.totalDeduction;
        return summary;
    }, {});

    for (const student in weeklySummary) {
        const conductRating = weeklySummary[student].remainingPoints >= 90 ? 'Excellent' : 'Good';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student}</td>
            <td>${weeklySummary[student].totalDeduction}</td>
            <td>${weeklySummary[student].remainingPoints}</td>
            <td>${conductRating}</td>
        `;
        weeklyTableBody.appendChild(row);
    }
}

async function loadStudentList() {
    try {
        const response = await fetch(`/api/hocsinh`);
        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return;
        }
        const studentSelect = document.getElementById('studentName');
        studentSelect.innerHTML = '';  // Xóa các mục cũ trước khi thêm mới
        data.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            studentSelect.appendChild(option);
        });
        studentRecords = data;

    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
    }

}
document.addEventListener('DOMContentLoaded', function () {
    loadStudentList();
});