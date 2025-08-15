// Portfolio filter
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const projects = document.querySelectorAll('.project');
  
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projects.forEach(project => {
          project.style.display = (filter === 'all' || project.getAttribute('data-category') === filter) ? 'block' : 'none';
        });
      });
    });
  });
  