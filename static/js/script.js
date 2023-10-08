function init() {
    d3.json("/api/v1/data/variables").then(function(data) {
        create_data_entry(data);
    });
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
        return d.description ? d.description.split(",") : [];
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
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while predicting edibility.');
      });
}


init();
