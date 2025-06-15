// CS50P Progress Tracker App
class CS50PTracker {
  constructor() {
    // Initialize data from provided JSON
    this.weeks = [
      {"id": 0, "title": "Week 0", "topic": "Functions, Variables", "lecture": false, "problemset": false, "notes": ""},
      {"id": 1, "title": "Week 1", "topic": "Conditionals", "lecture": false, "problemset": false, "notes": ""},
      {"id": 2, "title": "Week 2", "topic": "Loops", "lecture": false, "problemset": false, "notes": ""},
      {"id": 3, "title": "Week 3", "topic": "Exceptions", "lecture": false, "problemset": false, "notes": ""},
      {"id": 4, "title": "Week 4", "topic": "Libraries", "lecture": false, "problemset": false, "notes": ""},
      {"id": 5, "title": "Week 5", "topic": "Unit Tests", "lecture": false, "problemset": false, "notes": ""},
      {"id": 6, "title": "Week 6", "topic": "File I/O", "lecture": false, "problemset": false, "notes": ""},
      {"id": 7, "title": "Week 7", "topic": "Regular Expressions", "lecture": false, "problemset": false, "notes": ""},
      {"id": 8, "title": "Week 8", "topic": "Object-Oriented Programming", "lecture": false, "problemset": false, "notes": ""},
      {"id": 9, "title": "Week 9", "topic": "Et Cetera", "lecture": false, "problemset": false, "notes": ""},
      {"id": 10, "title": "Final Project", "topic": "Capstone Project", "lecture": false, "problemset": false, "notes": ""}
    ];

    this.dailyHabits = [
      "Lecture geschaut",
      "Problem Set bearbeitet", 
      "Notizen gemacht",
      "Hilfe gesucht",
      "Community Forum besucht"
    ];

    this.motivationalMessages = [
      "Großartig! Du machst echte Fortschritte! 🎉",
      "Weiter so! Jeder kleine Schritt zählt! ✨", 
      "Du bist auf dem richtigen Weg! 🚀",
      "Fantastisch! Du bleibst am Ball! 💪",
      "Super! Deine Kontinuität zahlt sich aus! 🌟"
    ];

    // Track daily habits for today
    this.todayHabits = {};
    this.studyTime = 0;
    this.streak = 0;
    this.lastActiveDate = null;

    this.init();
  }

  init() {
    this.renderWeeks();
    this.renderDailyHabits();
    this.updateProgress();
    this.setupEventListeners();
  }

  renderWeeks() {
    const container = document.getElementById('weeks-container');
    container.innerHTML = '';

    this.weeks.forEach(week => {
      const weekCard = this.createWeekCard(week);
      container.appendChild(weekCard);
    });
  }

  createWeekCard(week) {
    const card = document.createElement('div');
    card.className = 'week-card';
    card.id = `week-${week.id}`;
    
    const completedItems = (week.lecture ? 1 : 0) + (week.problemset ? 1 : 0);
    const progressText = completedItems === 2 ? '✅ Abgeschlossen' : `${completedItems}/2 erledigt`;
    
    if (completedItems === 2) {
      card.classList.add('completed');
    }

    card.innerHTML = `
      <div class="week-header">
        <div>
          <h3 class="week-title">${week.title}</h3>
          <p class="week-topic">${week.topic}</p>
        </div>
        <div class="week-progress">${progressText}</div>
      </div>
      
      <div class="checkbox-item ${week.lecture ? 'completed' : ''}">
        <input type="checkbox" id="lecture-${week.id}" ${week.lecture ? 'checked' : ''}>
        <label for="lecture-${week.id}">Lecture angeschaut</label>
      </div>
      
      <div class="checkbox-item ${week.problemset ? 'completed' : ''}">
        <input type="checkbox" id="problemset-${week.id}" ${week.problemset ? 'checked' : ''}>
        <label for="problemset-${week.id}">Problem Set gelöst</label>
      </div>
      
      <textarea 
        class="notes-input" 
        placeholder="Notizen zu schwierigen Themen..."
        data-week="${week.id}"
      >${week.notes}</textarea>
    `;

    return card;
  }

  renderDailyHabits() {
    const container = document.getElementById('habits-container');
    container.innerHTML = '';

    this.dailyHabits.forEach((habit, index) => {
      const habitItem = document.createElement('div');
      habitItem.className = `habit-item ${this.todayHabits[index] ? 'completed' : ''}`;
      
      habitItem.innerHTML = `
        <input type="checkbox" id="habit-${index}" ${this.todayHabits[index] ? 'checked' : ''}>
        <label for="habit-${index}">${habit}</label>
      `;
      
      container.appendChild(habitItem);
    });
  }

  setupEventListeners() {
    // Week progress checkboxes
    this.weeks.forEach(week => {
      const lectureCheckbox = document.getElementById(`lecture-${week.id}`);
      const problemsetCheckbox = document.getElementById(`problemset-${week.id}`);
      const notesTextarea = document.querySelector(`textarea[data-week="${week.id}"]`);

      lectureCheckbox.addEventListener('change', (e) => {
        this.updateWeekProgress(week.id, 'lecture', e.target.checked);
      });

      problemsetCheckbox.addEventListener('change', (e) => {
        this.updateWeekProgress(week.id, 'problemset', e.target.checked);
      });

      notesTextarea.addEventListener('input', (e) => {
        this.updateWeekNotes(week.id, e.target.value);
      });
    });

    // Daily habits checkboxes
    this.dailyHabits.forEach((habit, index) => {
      const habitCheckbox = document.getElementById(`habit-${index}`);
      habitCheckbox.addEventListener('change', (e) => {
        this.updateDailyHabit(index, e.target.checked);
      });
    });

    // Study time input
    const studyTimeInput = document.getElementById('study-time-input');
    studyTimeInput.addEventListener('input', (e) => {
      this.updateStudyTime(parseInt(e.target.value) || 0);
    });
  }

  updateWeekProgress(weekId, type, completed) {
    const week = this.weeks.find(w => w.id === weekId);
    if (week) {
      week[type] = completed;
      
      // Add animation for completed items
      const checkboxItem = document.querySelector(`#${type}-${weekId}`).closest('.checkbox-item');
      if (completed) {
        checkboxItem.classList.add('completed', 'just-completed');
        setTimeout(() => checkboxItem.classList.remove('just-completed'), 300);
      } else {
        checkboxItem.classList.remove('completed');
      }

      // Update week card
      const weekCard = document.getElementById(`week-${weekId}`);
      const completedItems = (week.lecture ? 1 : 0) + (week.problemset ? 1 : 0);
      const progressText = completedItems === 2 ? '✅ Abgeschlossen' : `${completedItems}/2 erledigt`;
      
      weekCard.querySelector('.week-progress').textContent = progressText;
      
      if (completedItems === 2) {
        weekCard.classList.add('completed');
      } else {
        weekCard.classList.remove('completed');
      }

      this.updateProgress();
      
      // Show motivational message for completed weeks
      if (completedItems === 2 && completed) {
        this.showMotivationalMessage();
      }
    }
  }

  updateWeekNotes(weekId, notes) {
    const week = this.weeks.find(w => w.id === weekId);
    if (week) {
      week.notes = notes;
    }
  }

  updateDailyHabit(habitIndex, completed) {
    this.todayHabits[habitIndex] = completed;
    
    const habitItem = document.getElementById(`habit-${habitIndex}`).closest('.habit-item');
    if (completed) {
      habitItem.classList.add('completed');
    } else {
      habitItem.classList.remove('completed');
    }
    
    this.updateStreak();
    this.updateProgress();
  }

  updateStudyTime(minutes) {
    this.studyTime = minutes;
    this.updateStreak();
  }

  updateStreak() {
    const today = new Date().toDateString();
    const hasStudiedToday = this.studyTime > 0 || Object.values(this.todayHabits).some(habit => habit);
    
    if (hasStudiedToday && this.lastActiveDate !== today) {
      if (this.lastActiveDate === this.getYesterday()) {
        this.streak++;
      } else if (this.lastActiveDate !== today) {
        this.streak = 1;
      }
      this.lastActiveDate = today;
    }
    
    document.querySelector('.streak-number').textContent = this.streak;
  }

  getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
  }

  updateProgress() {
    const totalItems = this.weeks.length * 2; // 2 items per week (lecture + problemset)
    let completedItems = 0;
    
    this.weeks.forEach(week => {
      if (week.lecture) completedItems++;
      if (week.problemset) completedItems++;
    });
    
    const percentage = Math.round((completedItems / totalItems) * 100);
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    const completionText = document.querySelector('.completion-text');
    
    progressFill.style.width = `${percentage}%`;
    completionText.textContent = `${percentage}% abgeschlossen`;
    
    // Update current week indicator
    this.updateCurrentWeek();
  }

  updateCurrentWeek() {
    const currentWeek = this.weeks.find(week => 
      !week.lecture || !week.problemset
    );
    
    if (currentWeek) {
      // You could add visual indication of current week here
      console.log(`Aktuelle Woche: ${currentWeek.title}`);
    }
  }

  showMotivationalMessage() {
    const randomMessage = this.motivationalMessages[
      Math.floor(Math.random() * this.motivationalMessages.length)
    ];
    
    const motivationElement = document.getElementById('motivation-text');
    motivationElement.textContent = randomMessage;
    
    // Add a subtle animation
    motivationElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
      motivationElement.style.transform = 'scale(1)';
    }, 200);
  }

  // Method to get overall statistics
  getStatistics() {
    const totalWeeks = this.weeks.length;
    const completedWeeks = this.weeks.filter(week => week.lecture && week.problemset).length;
    const totalHabitsToday = Object.values(this.todayHabits).filter(Boolean).length;
    
    return {
      totalWeeks,
      completedWeeks,
      totalHabitsToday,
      studyTime: this.studyTime,
      streak: this.streak
    };
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const tracker = new CS50PTracker();
  
  // Optional: Add some sample data for demonstration
  // Uncomment the lines below to see some pre-filled progress
  /*
  setTimeout(() => {
    tracker.updateWeekProgress(0, 'lecture', true);
    tracker.updateWeekProgress(0, 'problemset', true);
    tracker.updateDailyHabit(0, true);
    tracker.updateDailyHabit(2, true);
    tracker.updateStudyTime(45);
  }, 1000);
  */
});