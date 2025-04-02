document.addEventListener('DOMContentLoaded', function() {
  // Handle exit button click
  const exitButton = document.querySelector('.exit-button');
  exitButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to exit?')) {
      window.close();
    }
  });

  
});