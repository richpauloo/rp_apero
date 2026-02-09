// Garden card filter logic (Hugo renders the cards, JS just filters)
(function() {
  'use strict';

  var filtersContainer = document.getElementById('filters');
  var grid = document.getElementById('card-grid');
  if (!filtersContainer || !grid) return;

  filtersContainer.addEventListener('click', function(e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersContainer.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');

    var type = btn.dataset.filter;
    grid.querySelectorAll('.card').forEach(function(card) {
      card.classList.toggle('hidden', type !== 'all' && card.dataset.type !== type);
    });
  });
})();
