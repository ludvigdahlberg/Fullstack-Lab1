document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#dishes tbody');

  // Load all dishes
  fetch('/api/dishes')
    .then(res => res.json())
    .then(dishes => {
      dishes.forEach(d => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${d.name}</td>
          <td>${d.ingredients?.join(', ') || 'N/A'}</td>
          <td>${d.preperationSteps?.join(', ') || 'N/A'}</td>
          <td>${d.cookingTime ?? 'Unknown'} min</td>
          <td>${d.origin ?? 'Unknown'}</td>
          <td>${d.tasteRanking ?? 'Unrated'}</td>
          <td><button class="edit-btn" data-id="${d._id}">Edit</button></td>
          <td><button class="delete-btn" data-id="${d._id}">Delete</button></td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => console.error("Error loading dishes:", err));

  // Handle Edit and Delete button clicks
  tableBody.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    // DELETE
    if (e.target.classList.contains('delete-btn')) {
      if (confirm("Are you sure you want to delete this dish?")) {
        try {
          const res = await fetch(`/api/dishes/${id}`, { method: 'DELETE' });
          const result = await res.json();
          alert('Dish deleted!');
          location.reload();
        } catch (error) {
          console.error("Delete failed:", error);
        }
      }
    }

    // EDIT
    if (e.target.classList.contains('edit-btn')) {
      const name = prompt("Enter new dish name:");
      if (!name) return;

      const ingredients = prompt("Enter ingredients (comma-separated):");
      const preperationSteps = prompt("Enter steps (comma-separated):");
      const cookingTime = prompt("Enter cooking time (in minutes):");
      const origin = prompt("Enter origin:");
      const tasteRanking = prompt("Enter taste ranking (1/5):");

      const updatedDish = {
        name,
        ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : [],
        preperationSteps: preperationSteps ? preperationSteps.split(',').map(s => s.trim()) : [],
        cookingTime: parseInt(cookingTime),
        origin,
        tasteRanking: parseInt(tasteRanking)
      };

      try {
        const res = await fetch(`/api/dishes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDish)
        });
        const result = await res.json();
        alert('Dish updated!');
        location.reload();
      } catch (error) {
        console.error("Edit failed:", error);
      }
    }
  });

  // Dish search
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('dishName').value.trim();

      fetch(`/api/dishes/${name}`)
        .then(res => {
          if (!res.ok) throw new Error("Dish not found");
          return res.json();
        })
        .then(dish => {
          document.getElementById('result').innerHTML = `
            <h3>${dish.name}</h3>
            <p><strong>Ingredients:</strong> ${dish.ingredients?.join(', ')}</p>
            <p><strong>Preparation steps:</strong> ${dish.preperationSteps?.join(', ')}</p>
            <p><strong>Time:</strong> ${dish.cookingTime ?? 'unknown'} min</p>
            <p><strong>Origin:</strong> ${dish.origin ?? 'unknown'}</p>
            <p><strong>Taste Ranking:</strong> ${dish.tasteRanking ?? 'unknown'}</p>
          `;
        })
        .catch(err => {
          document.getElementById('result').innerHTML = `<p style="color:red;"> ${err.message}</p>`;
        });
    });
  }

  // Add new ingredient field
  window.addIngredient = function () {
    const wrapper = document.getElementById('ingredients-wrapper');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'ingredients[]';
    input.placeholder = 'Another ingredient';
    wrapper.appendChild(input);
  };

  // Add new step field
  window.addStep = function () {
    const wrapper = document.getElementById('steps-wrapper');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'preperationSteps[]';
    input.placeholder = 'Another step';
    wrapper.appendChild(input);
  };

  // Add new dish
  const addForm = document.getElementById('add-dish-form');
  if (addForm) {
    addForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(addForm);

      const dish = {
        name: formData.get('name'),
        ingredients: formData.getAll('ingredients[]'),
        preperationSteps: formData.getAll('preperationSteps[]'),
        cookingTime: parseInt(formData.get('cookingTime')) || null,
        origin: formData.get('origin'),
        tasteRanking: parseInt(formData.get('tasteRanking')) || null
      };

      try {
        const res = await fetch('/api/dishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dish)
        });

        const data = await res.json();
        if (res.ok) {
          alert('Dish added!');
          addForm.reset();
          document.getElementById('ingredients-wrapper').innerHTML =
            '<label for="ingredients">Ingredients</label><input type="text" name="ingredients[]" placeholder="Ingredient 1" required>';
          document.getElementById('steps-wrapper').innerHTML =
            '<label>Preparation Steps:</label><input type="text" name="preperationSteps[]" placeholder="Step 1" required>';
          location.reload();
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to submit dish");
      }
    });
  }
});
