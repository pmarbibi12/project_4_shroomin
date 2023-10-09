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
      .attr("class", d => `categorical-item ${d.name}`); // Add class based on label name
  
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
        else if (prediction > .8){
            results.append("p").text("Most likely edible!");
        }
        else if (prediction >= .5){
            results.append("p").text("Questionable!");
        }
        else {
            results.append("p").text("You didn't select anything, silly!");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while predicting edibility.');
      });
}

function create_predefined_options() {
    // Create an array of mushroom types with associated image file names
    const mushroomTypes = [
      { name: "Portabella Mushrooms", image: "Portobello_mushrooms.jpg" },
      { name: "Chanterelle Mushrooms", image: "Cantharellus_cibarius.jpg" },
      { name: "Shiitake Mushrooms", image: "Shiitakegrowing.jpg" },
      { name: "Oyster Mushrooms", image: "oyster_mushrooms.jpg" },
      { name: "Enoki Mushrooms", image: "enoki.jpg" },
      { name: "Death Cap Mushrooms", image: "Death_cap.jpg" },
      { name: "Fly Agaric Mushrooms", image: "fly_agaric.jpg" }
    ];
  
    // Select the container div using D3
    const container = d3.select("#predefined_mushrooms");
  
    // Create buttons and append them to the container
    container
      .selectAll(".mushroom-button")
      .data(mushroomTypes)
      .enter()
      .append("div")
      .attr("class", "mushroom-button")
      .style("background-image", d => `url('/static/assets/${d.image}')`)
      .text(d => d.name)
      .on("click", function() {
        const mushroomType = this.textContent; // Get the text content of the clicked button
        console.log(`Button clicked for ${mushroomType}`);
        predefined_buttons(mushroomType); // Pass the text content to predefined_buttons
      });
  }

function predefined_buttons(mushroomType) {
    const mushroomData = {
      "Portabella Mushrooms": {
        'Cap-shape': 'x',
        'Cap-surface': 's',
        'Cap-color': 'n',
        'Bruises': 't',
        'Odor': 'l',
        'Gill-attachment': 'a',
        'Gill-spacing': 'w',
        'Gill-size': 'b',
        'Gill-color': 'n',
        'Stalk-shape': 'e',
        'Stalk-root': 'r',
        'Stalk-surface-above-ring': 's',
        'Stalk-surface-below-ring': 's',
        'Stalk-color-above-ring': 'n',
        'Stalk-color-below-ring': 'n',
        'Veil-type': 'p',
        'Veil-color': 'w',
        'Ring-number': 'o',
        'Ring-type': 'p',
        'Spore-print-color': 'b',
        'Population': 'n',
        'Habitat': 'd'
      },
      "Chanterelle Mushrooms": {
        'Cap-shape': 'x',
        'Cap-surface': 's',
        'Cap-color': 'y',  
        'Bruises': 'f',   
        'Odor': 'l',
        'Gill-attachment': 'a',
        'Gill-spacing': 'd', 
        'Gill-size': 'b',
        'Gill-color': 'o',  
        'Stalk-shape': 'e',
        'Stalk-root': '?',  
        'Stalk-surface-above-ring': 's',
        'Stalk-surface-below-ring': 's',
        'Stalk-color-above-ring': 'y',  
        'Stalk-color-below-ring': 'y', 
        'Veil-type': 'p',
        'Veil-color': 'w',
        'Ring-number': 'n',  
        'Ring-type': 'n',   
        'Spore-print-color': 'y',  
        'Population': 'n',
        'Habitat': 'd'
      },
      "Shiitake Mushrooms": {
        'Cap-shape': 'x',
        'Cap-surface': 'f',
        'Cap-color': 'n',
        'Bruises': 'f',    
        'Odor': 'm',       
        'Gill-attachment': 'a',
        'Gill-spacing': 'c', 
        'Gill-size': 'b',
        'Gill-color': 'w',
        'Stalk-shape': 'e',
        'Stalk-root': 'r',
        'Stalk-surface-above-ring': 'k', 
        'Stalk-surface-below-ring': 'k',
        'Stalk-color-above-ring': 'n',
        'Stalk-color-below-ring': 'n',
        'Veil-type': 'p',
        'Veil-color': 'w',
        'Ring-number': 'o',  
        'Ring-type': 'p',
        'Spore-print-color': 'b',
        'Population': 'n',
        'Habitat': 'd'      
      },
      "Oyster Mushrooms": {
        'Cap-shape': 'f',
        'Cap-surface': 's',
        'Cap-color': 'w',
        'Bruises': 'f',   
        'Odor': 'a',     
        'Gill-attachment': 'a',
        'Gill-spacing': 'c', 
        'Gill-size': 'b',
        'Gill-color': 'w',
        'Stalk-shape': 'e',
        'Stalk-root': 'r',
        'Stalk-surface-above-ring': 's',
        'Stalk-surface-below-ring': 's',
        'Stalk-color-above-ring': 'w',
        'Stalk-color-below-ring': 'w',
        'Veil-type': 'p',
        'Veil-color': 'w',
        'Ring-number': 'n', 
        'Ring-type': 'n',   
        'Spore-print-color': 'w',
        'Population': 'n',
        'Habitat': 'd'     
      },
      "Enoki Mushrooms": {
        'Cap-shape': 'c',   // Change to 'c' for conical
        'Cap-surface': 's',
        'Cap-color': 'w',
        'Bruises': 'f',     // Change to 'f' for no
        'Odor': 'n',        // Change to 'n' for none
        'Gill-spacing': 'c', // Change to 'c' for crowded
        'Gill-size': 'n',    // Change to 'n' for narrow
        'Gill-color': 'w',
        'Stalk-shape': 't',  // Change to 't' for tapering
        'Stalk-root': 'r',
        'Stalk-surface-above-ring': 's',
        'Stalk-surface-below-ring': 's',
        'Stalk-color-above-ring': 'w',
        'Stalk-color-below-ring': 'w',
        'Veil-type': 'p',
        'Veil-color': 'w',
        'Ring-number': 'n',  // Change to 'n' for none
        'Ring-type': 'n',    // Change to 'n' for none
        'Spore-print-color': 'w',
        'Population': 'n',
        'Habitat': 'd'       // Change to 'd' for woods
      },
      "Death Cap Mushrooms": {
        'Cap-shape': 'x',   
        'Cap-surface': 's', 
        'Cap-color': 'r',   
        'Bruises': 't',
        'Odor': 'l',       
        'Gill-attachment': 'a',
        'Gill-spacing': 'w', 
        'Gill-size': 'n',    
        'Gill-color': 'w',
        'Stalk-shape': 't',  
        'Stalk-root': 'b',   
        'Stalk-surface-above-ring': 's',
        'Stalk-surface-below-ring': 'y',
        'Stalk-color-above-ring': 'y',  
        'Stalk-color-below-ring': 'y',  
        'Veil-type': 'p',
        'Veil-color': 'w',
        'Ring-number': 'o',   
        'Ring-type': 's',     
        'Spore-print-color': 'w',
        'Population': 'v',    
        'Habitat': 'd'        
      },
      "Fly Agaric Mushrooms": {
        'Cap-shape': 'x',   
        'Cap-surface': 's', 
        'Cap-color': 'e',   
        'Bruises': 'f',
        'Odor': 'f',       
        'Gill-attachment': 'f',
        'Gill-spacing': 'w', 
        'Gill-size': 'n',    
        'Gill-color': 'w',
        'Stalk-shape': 't',  
        'Stalk-root': 'b',   
        'Stalk-surface-above-ring': 's',
        'Stalk-surface-below-ring': 'y',
        'Stalk-color-above-ring': 'w',  
        'Stalk-color-below-ring': 'w',  
        'Veil-type': 'u',
        'Veil-color': 'w',
        'Ring-number': 't',   
        'Ring-type': 'z',     
        'Spore-print-color': 'w',
        'Population': 'c',    
        'Habitat': 'd'        
      }
    };
  
    if (mushroomData[mushroomType]) {
      const mushroomValues = mushroomData[mushroomType];
  
      for (const category in mushroomValues) {
        const value = mushroomValues[category];
        d3.select(`.${category.toLowerCase()} select`)
          .property('value', value);
      }
    }
  }
  



init();
