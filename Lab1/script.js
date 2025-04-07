// script.js

// Hämta alla rätter
fetch('/api/dishes')
  .then(res => res.json())
  .then(dishes => {
    const list = document.getElementById('dish-list');
    dishes.forEach(d => {
      const li = document.createElement('li');
      li.textContent = d.name;
      list.appendChild(li);
    });
  })
  .catch(err => console.error("Fel:", err));

// Sök efter specifik rätt
document.getElementById('dish-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('dishName').value.trim();

  fetch(`/api/dishes/${name}`)
    .then(res => {
      if (!res.ok) throw new Error("Hittade inte rätten");
      return res.json();
    })
    .then(dish => {
      document.getElementById('result').innerHTML = `
        <h3>${dish.name}</h3>
        <p><strong>Ingredients:</strong> ${dish.ingredients?.join(', ')}</p>
        <p><strong>Preperation steps:</strong> ${dish.preperationSteps?.join(', ')}</p>
        <p><strong>Time:</strong> ${dish.cookingTime || 'okänd'} min</p>
        <p><strong>Origin:</strong> ${dish.origin || 'okänd'}</p>
        <p><strong>Taste Ranking:</strong> ${dish.tasteRanking || 'okänd'}</p>
      `;
    })
    .catch(err => {
      document.getElementById('result').innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
    });
});
