function init() {
    d3.json("/api/v1/data/variables").then(function(data) {
        create_data_entry(data);
    });

    create_predefined_options();
};

function create_data_entry(data) {
  // Filter data for items of type "Categorical"
  const categoricalData = data.filter(item => item.role === "Feature");

  // Select the container element (you may want to replace 'categories' with your actual container ID or selector)
  const container = d3.select("#categories");

  // Create labels and dropdowns within the container
  const dropdowns = container
    .selectAll(".categorical-item")
    .data(categoricalData)
    .enter()
    .append("div")
    .attr("class", "categorical-item");

  dropdowns
    .append("label")
    .text(d => d.name.charAt(0).toUpperCase() + d.name.slice(1) + ": ");

  dropdowns
    .append("select")
    .selectAll("option")
    .data(d => {
      // Check if description is null or undefined before splitting
      const options = d.description ? d.description.split(",") : [];
      // Add <unknown> as the first option
      options.unshift("<unknown>");
      return options;
    })
    .enter()
    .append("option")
    .text(d => {
      // Check if the item has the format key=value before displaying
      const parts = d.split("=");
      return parts.length === 2 ? parts[0] : d;
    })
    .attr("value", d => {
      // Check if the item has the format key=value before setting value
      const parts = d.split("=");
      return parts.length === 2 ? parts[1] : d;
    });
}

  

function is_edible() {
    const selectedValues = {};
  
    d3.selectAll(".categorical-item select").each(function() {
        const label = d3.select(this.parentNode).select("label").text().trim().replace(':', '').toLowerCase();
 // Convert label to lowercase
        const value = d3.select(this).property("value");
        selectedValues[label] = value;
    });

    // Now 'selectedValues' is an object where the keys are the lowercase labels, and the values are the selected dropdown values.
    // console.log(selectedValues);
    
    fetch('/api/v1/machine-learning/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedValues),
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the API
        console.log("Response JSON:", data);
        const prediction = data.prediction; // Assuming your API returns a 'prediction' field
        alert(`Prediction: ${prediction}`);
        console.log(`Prediction: ${prediction}`);
        const results = d3.select('#results');
        if (prediction < .5) {
            results.append("p").text("I would not recommend eating this!");
        } 
        else {
            results.append("p").text("Most likely edible!");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while predicting edibility.');
      });
}

function create_predefined_options() {
  // Create an array of mushroom types
  const mushroomTypes = [
    "Portabella Mushrooms",
    "Chanterelle Mushrooms",
    "Shiitake Mushrooms",
    "Oyster Mushrooms",
    "Enoki Mushrooms",
    "Death Cap Mushrooms",
    "Fly Agaric Mushrooms"
  ];

  // Select the container div using D3
  const container = d3.select("#predefined_mushrooms");

  // Create buttons and append them to the container
  container
    .selectAll("button")
    .data(mushroomTypes)
    .enter()
    .append("button")
    .text(d => d) // Set the text of the button to the mushroom type
    .attr("class", "mushroom-button") // Optional: Add a class for styling
    .on("click", function(d) {
      console.log(`Button clicked for ${d}`);
      predefined_buttons(d);
    });
}

// Define the predefined_buttons() function
function predefined_buttons(mushroomType) {
  // Create an object that maps mushroom categories to their values
  console.log(mushroomType)
  const portabella = {
    'Cap-shape': 'convex',
    'Cap-surface': 'smooth',
    'Cap-color': 'brown',
    'Bruises': 'bruises',
    'Odor': 'anise',
    'Gill-attachment': 'attached',
    'Gill-spacing': 'crowded',
    'Gill-size': 'broad',
    'Gill-color': 'brown',
    'Stalk-shape': 'enlarging',
    'Stalk-root': 'rooted',
    'Stalk-surface-above-ring': 'smooth',
    'Stalk-surface-below-ring': 'smooth',
    'Stalk-color-above-ring': 'brown',
    'Stalk-color-below-ring': 'brown',
    'Veil-type': 'partial',
    'Veil-color': 'white',
    'Ring-number': 'one',
    'Ring-type': 'pendant',
    'Spore-print-color': 'brown',
    'Population': 'numerous',
    'Habitat': 'woods'
  };

  if (mushroomType=="Portabella Mushrooms")
  // Loop through the categories and populate the dropdowns
    for (const category in portabella) {
      const select = document.querySelector(`#categories [name="${category}"] select`);
      if (select) {
        const value = portabella[category];
        select.value = value;
      }
    }
}



init();
