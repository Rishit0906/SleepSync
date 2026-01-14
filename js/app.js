// ===================================
// SleepSync - Sleep Tracking App
// Main JavaScript Application
// ===================================

// ===================================
// Application State
// ===================================
const AppState = {
    sleepLogs: [],
    currentView: 'dashboard',
    chart: null
};

// ===================================
// Utility Functions
// ===================================

// Calculate sleep duration in hours
function calculateSleepDuration(bedtime, waketime, date) {
    const bedDate = new Date(`${date} ${bedtime}`);
    let wakeDate = new Date(`${date} ${waketime}`);
    
    // If wake time is earlier than bedtime, add one day
    if (wakeDate <= bedDate) {
        wakeDate = new Date(wakeDate.getTime() + 24 * 60 * 60 * 1000);
    }
    
    const duration = (wakeDate - bedDate) / (1000 * 60 * 60); // Convert to hours
    return Math.round(duration * 10) / 10; // Round to 1 decimal place
}

// Format duration for display
function formatDuration(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Generate unique ID
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Local Storage Functions
// ===================================

function saveToLocalStorage() {
    localStorage.setItem('sleepLogs', JSON.stringify(AppState.sleepLogs));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('sleepLogs');
    if (stored) {
        AppState.sleepLogs = JSON.parse(stored);
    } else {
        // Initialize with sample data for demo
        AppState.sleepLogs = generateSampleData();
        saveToLocalStorage();
    }
}

function generateSampleData() {
    const sampleData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        sampleData.push({
            id: generateId(),
            date: dateString,
            bedtime: '22:30',
            waketime: '06:30',
            duration: 8.0,
            quality: Math.floor(Math.random() * 3) + 7, // 7-10
            mood: ['energized', 'refreshed', 'neutral'][Math.floor(Math.random() * 3)],
            factors: ['exercise'],
            notes: ''
        });
    }
    
    return sampleData;
}

// ===================================
// View Navigation
// ===================================

function switchView(viewName) {
    // Update view visibility
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    AppState.currentView = viewName;
    
    // Refresh view content
    if (viewName === 'dashboard') {
        updateDashboard();
    } else if (viewName === 'insights') {
        updateInsights();
    }
}

// ===================================
// Dashboard Functions
// ===================================

function updateDashboard() {
    updateStats();
    updateChart();
    updateRecentLogs();
}

function updateStats() {
    const logs = AppState.sleepLogs;
    
    if (logs.length === 0) {
        document.getElementById('avgSleep').textContent = '0h';
        document.getElementById('avgQuality').textContent = 'N/A';
        document.getElementById('streak').textContent = '0 days';
        document.getElementById('totalLogs').textContent = '0';
        return;
    }
    
    // Average sleep duration
    const avgDuration = logs.reduce((sum, log) => sum + log.duration, 0) / logs.length;
    document.getElementById('avgSleep').textContent = formatDuration(avgDuration);
    
    // Average quality
    const avgQuality = logs.reduce((sum, log) => sum + log.quality, 0) / logs.length;
    document.getElementById('avgQuality').textContent = `${avgQuality.toFixed(1)}/10`;
    
    // Calculate streak
    const streak = calculateStreak();
    document.getElementById('streak').textContent = `${streak} ${streak === 1 ? 'day' : 'days'}`;
    
    // Total logs
    document.getElementById('totalLogs').textContent = logs.length;
}

function calculateStreak() {
    if (AppState.sleepLogs.length === 0) return 0;
    
    const sortedLogs = [...AppState.sleepLogs].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedLogs.length; i++) {
        const logDate = new Date(sortedLogs[i].date);
        logDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        expectedDate.setHours(0, 0, 0, 0);
        
        if (logDate.getTime() === expectedDate.getTime()) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

function updateChart() {
    const canvas = document.getElementById('sleepChart');
    const ctx = canvas.getContext('2d');
    
    // Get last 7 days of data
    const last7Days = AppState.sleepLogs.slice(-7);
    
    const labels = last7Days.map(log => formatDate(log.date));
    const durations = last7Days.map(log => log.duration);
    const qualities = last7Days.map(log => log.quality);
    
    // Destroy existing chart if it exists
    if (AppState.chart) {
        AppState.chart.destroy();
    }
    
    // Create new chart
    AppState.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Sleep Duration (hours)',
                    data: durations,
                    backgroundColor: 'rgba(74, 95, 217, 0.6)',
                    borderColor: 'rgba(74, 95, 217, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    yAxisID: 'y'
                },
                {
                    label: 'Quality (1-10)',
                    data: qualities,
                    type: 'line',
                    borderColor: 'rgba(255, 184, 108, 1)',
                    backgroundColor: 'rgba(255, 184, 108, 0.2)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(44, 62, 80, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.datasetIndex === 0) {
                                    label += formatDuration(context.parsed.y);
                                } else {
                                    label += context.parsed.y + '/10';
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Hours',
                        font: {
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    max: 12,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Quality',
                        font: {
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 10,
                    grid: {
                        drawOnChartArea: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateRecentLogs() {
    const container = document.getElementById('recentLogsList');
    const recentLogs = [...AppState.sleepLogs]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recentLogs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😴</div>
                <p>No sleep logs yet. Start tracking your sleep!</p>
            </div>
        `;
        return;
    }
    
    // Store current first log ID to detect new entries
    const currentFirstLogId = container.firstElementChild?.dataset?.logId;
    
    container.innerHTML = recentLogs.map((log, index) => `
        <div class="log-item${index === 0 && log.id !== currentFirstLogId ? ' new-log' : ''}" data-log-id="${log.id}">
            <div class="log-header">
                <span class="log-date">${formatDate(log.date)}</span>
                <span class="log-quality">
                    ⭐ ${log.quality}/10
                </span>
            </div>
            <div class="log-details">
                <span class="log-detail">
                    😴 ${formatDuration(log.duration)}
                </span>
                <span class="log-detail">
                    🛏️ ${log.bedtime} - ${log.waketime}
                </span>
                <span class="log-detail">
                    ${getMoodEmoji(log.mood)} ${log.mood}
                </span>
            </div>
        </div>
    `).join('');
    
    // Trigger animation for new log
    setTimeout(() => {
        const newLog = container.querySelector('.new-log');
        if (newLog) {
            newLog.classList.remove('new-log');
        }
    }, 1000);
}

function getMoodEmoji(mood) {
    const moodMap = {
        'energized': '😄',
        'refreshed': '😊',
        'neutral': '😐',
        'tired': '😴',
        'exhausted': '😫'
    };
    return moodMap[mood] || '😐';
}

// ===================================
// Sleep Form Functions
// ===================================

function initializeSleepForm() {
    const form = document.getElementById('sleepForm');
    const dateInput = document.getElementById('sleepDate');
    const qualityInput = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const notesInput = document.getElementById('notes');
    const charCount = document.getElementById('charCount');
    
    // Set default date to today
    dateInput.value = new Date().toISOString().split('T')[0];
    dateInput.max = new Date().toISOString().split('T')[0];
    
    // Quality slider
    qualityInput.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value;
    });
    
    // Character count for notes
    notesInput.addEventListener('input', (e) => {
        charCount.textContent = e.target.value.length;
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
    });
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.classList.remove('error');
    });
    
    // Get form data
    const formData = new FormData(e.target);
    const date = formData.get('sleepDate');
    const bedtime = formData.get('bedtime');
    const waketime = formData.get('waketime');
    const quality = parseInt(formData.get('quality'));
    const mood = formData.get('mood');
    const factors = formData.getAll('factors');
    const notes = formData.get('notes');
    
    // Validate
    let isValid = true;
    
    if (!date) {
        showError('sleepDate', 'dateError', 'Please select a date');
        isValid = false;
    }
    
    if (!bedtime) {
        showError('bedtime', 'bedtimeError', 'Please enter bedtime');
        isValid = false;
    }
    
    if (!waketime) {
        showError('waketime', 'waketimeError', 'Please enter wake time');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    // Calculate duration
    const duration = calculateSleepDuration(bedtime, waketime, date);
    
    // Create sleep log object
    const sleepLog = {
        id: generateId(),
        date,
        bedtime,
        waketime,
        duration,
        quality,
        mood,
        factors,
        notes: notes.trim()
    };
    
    // Add to state and save
    AppState.sleepLogs.push(sleepLog);
    saveToLocalStorage();
    
    // Reset form
    e.target.reset();
    document.getElementById('sleepDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('qualityValue').textContent = '5';
    document.getElementById('charCount').textContent = '0';
    
    // Update dashboard immediately (even if we're on the log view)
    // This ensures the data is fresh when we switch views
    updateStats();
    updateChart();
    updateRecentLogs();
    
    // Show success message
    showToast('Sleep log saved successfully! 🎉', 'success');
    
    // Switch to dashboard to show the updated logs
    setTimeout(() => {
        switchView('dashboard');
    }, 1500);
}

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add('error');
    document.getElementById(errorId).textContent = message;
}

// ===================================
// Insights Functions
// ===================================

function updateInsights() {
    if (AppState.sleepLogs.length === 0) {
        document.getElementById('bestDay').textContent = 'N/A';
        document.getElementById('bestDayDetail').textContent = 'No data yet';
        document.getElementById('optimalBedtime').textContent = 'N/A';
        document.getElementById('topFactor').textContent = 'N/A';
        document.getElementById('weeklyTrend').textContent = 'N/A';
        return;
    }
    
    // Best sleep day
    const dayStats = calculateDayStats();
    const bestDay = Object.entries(dayStats).sort((a, b) => b[1].avg - a[1].avg)[0];
    if (bestDay) {
        document.getElementById('bestDay').textContent = bestDay[0];
        document.getElementById('bestDayDetail').textContent = `Avg: ${formatDuration(bestDay[1].avg)}`;
    }
    
    // Optimal bedtime (most common bedtime for quality >= 8)
    const goodSleepLogs = AppState.sleepLogs.filter(log => log.quality >= 8);
    if (goodSleepLogs.length > 0) {
        const bedtimes = goodSleepLogs.map(log => log.bedtime);
        const mostCommonBedtime = getMostCommon(bedtimes);
        document.getElementById('optimalBedtime').textContent = formatTime(mostCommonBedtime);
    }
    
    // Top factor
    const factorStats = calculateFactorStats();
    if (factorStats.length > 0) {
        document.getElementById('topFactor').textContent = 
            factorStats[0].factor.charAt(0).toUpperCase() + factorStats[0].factor.slice(1);
    }
    
    // Weekly trend
    const trend = calculateWeeklyTrend();
    const trendElement = document.getElementById('weeklyTrend');
    if (trend > 0) {
        trendElement.textContent = '↗ Improving';
        trendElement.className = 'insight-value trend-up';
    } else if (trend < 0) {
        trendElement.textContent = '↘ Declining';
        trendElement.className = 'insight-value trend-down';
    } else {
        trendElement.textContent = '→ Stable';
        trendElement.className = 'insight-value';
    }
}

function calculateDayStats() {
    const dayMap = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    AppState.sleepLogs.forEach(log => {
        const date = new Date(log.date);
        const dayName = dayNames[date.getDay()];
        
        if (!dayMap[dayName]) {
            dayMap[dayName] = { total: 0, count: 0, avg: 0 };
        }
        
        dayMap[dayName].total += log.duration;
        dayMap[dayName].count += 1;
    });
    
    Object.keys(dayMap).forEach(day => {
        dayMap[day].avg = dayMap[day].total / dayMap[day].count;
    });
    
    return dayMap;
}

function calculateFactorStats() {
    const factorMap = {};
    
    AppState.sleepLogs.forEach(log => {
        log.factors.forEach(factor => {
            if (!factorMap[factor]) {
                factorMap[factor] = { totalQuality: 0, count: 0 };
            }
            factorMap[factor].totalQuality += log.quality;
            factorMap[factor].count += 1;
        });
    });
    
    return Object.entries(factorMap)
        .map(([factor, stats]) => ({
            factor,
            avgQuality: stats.totalQuality / stats.count,
            count: stats.count
        }))
        .sort((a, b) => b.avgQuality - a.avgQuality);
}

function calculateWeeklyTrend() {
    if (AppState.sleepLogs.length < 7) return 0;
    
    const sortedLogs = [...AppState.sleepLogs].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    const recentWeek = sortedLogs.slice(-7);
    const previousWeek = sortedLogs.slice(-14, -7);
    
    if (previousWeek.length === 0) return 0;
    
    const recentAvg = recentWeek.reduce((sum, log) => sum + log.duration, 0) / recentWeek.length;
    const previousAvg = previousWeek.reduce((sum, log) => sum + log.duration, 0) / previousWeek.length;
    
    const diff = recentAvg - previousAvg;
    return diff > 0.3 ? 1 : diff < -0.3 ? -1 : 0;
}

function getMostCommon(arr) {
    const frequency = {};
    let maxFreq = 0;
    let mostCommon = arr[0];
    
    arr.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
        if (frequency[item] > maxFreq) {
            maxFreq = frequency[item];
            mostCommon = item;
        }
    });
    
    return mostCommon;
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// ===================================
// Initialization
// ===================================

function init() {
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Initialize navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });
    
    // Initialize sleep form
    initializeSleepForm();
    
    // Update dashboard
    updateDashboard();
    
    // Log initialization
    console.log('🌙 SleepSync initialized successfully!');
    console.log(`📊 Loaded ${AppState.sleepLogs.length} sleep logs`);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// Export for debugging (optional)
// ===================================
window.SleepSync = {
    state: AppState,
    clearData: () => {
        if (confirm('Are you sure you want to clear all sleep data?')) {
            AppState.sleepLogs = [];
            saveToLocalStorage();
            updateDashboard();
            showToast('All data cleared', 'info');
        }
    },
    exportData: () => {
        const dataStr = JSON.stringify(AppState.sleepLogs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sleepsync-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        showToast('Data exported successfully!', 'success');
    }
};
