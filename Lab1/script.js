
// all dishes 
fetch('/api/dishes')
  .then(res => res.json())
  .then(dishes => {
    const list = document.getElementById('dish-list');
    const ol = document.createElement('ol');

    dishes.forEach(d => {
      const li = document.createElement('li');

      const name = document.createElement('p');
      name.textContent = `Name: ${d.name}`;

      const ingredients = document.createElement('p');
      ingredients.textContent = `Ingredients: ${d.ingredients}`;

      const steps = document.createElement('p');
      steps.textContent = `Preparation Steps: ${d.preperationSteps}`;

      const time = document.createElement('p');
      time.textContent = `Cooking Time: ${d.cookingTime}`;

      const origin = document.createElement('p');
      origin.textContent = `Origin: ${d.origin}`;

      const ranking = document.createElement('p');
      ranking.textContent = `Taste Ranking: ${d.tasteRanking}`;

      li.appendChild(name);
      li.appendChild(ingredients);
      li.appendChild(steps);
      li.appendChild(time);
      li.appendChild(origin);
      li.appendChild(ranking);

      ol.appendChild(li);
    });

    list.appendChild(ol);
  })
  .catch(err => console.error("Fel:", err));

// search for dish
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
