let myChart; // Variabel untuk menyimpan instance Chart

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("interpolation-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const x0 = parseFloat(document.getElementById("x0").value);
      const y0 = parseFloat(document.getElementById("y0").value);
      const x1 = parseFloat(document.getElementById("x1").value);
      const y1 = parseFloat(document.getElementById("y1").value);
      const x = parseFloat(document.getElementById("x").value);

      fetch("/interpolasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ x0, y0, x1, y1, x }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || "Error tidak diketahui");
            });
          }
          return response.json();
        })
        .then((data) => {
          document.getElementById(
            "result"
          ).innerText = `f(${x}) = ${data.hasil}`;

          // Hancurkan chart yang ada jika sudah ada
          if (myChart && typeof myChart.destroy === "function") {
            myChart.destroy();
          }

          const ctx = document.getElementById("myChart").getContext("2d");

          myChart = new Chart(ctx, {
            type: "scatter",
            data: {
              datasets: [
                {
                  label: "Hasil Interpolasi",
                  data: [{ x: data.x, y: data.hasil }],
                  backgroundColor: "rgba(47, 30, 64)",
                  borderColor: "rgba(47, 30, 64)",
                  borderWidth: 3,
                  pointRadius: 7,
                },
                {
                  label: "Interpolasi Linier",
                  data: [
                    { x: data.x0, y: data.y0 },
                    { x: data.x, y: data.hasil },
                    { x: data.x1, y: data.y1 },
                  ],
                  showLine: true,
                  fill: false,
                  borderColor: "rgba(95, 245, 11, 1)",
                  backgroundColor: "rgba(95, 245, 11, 1)",
                  borderWidth: 2,
                  pointRadius: 5,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                  title: {
                    display: true,
                    text: "X",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "f(X)",
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `(${context.raw.x}, ${context.raw.y})`;
                    },
                  },
                },
              },
            },
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById(
            "result"
          ).innerText = `Error: ${error.message}`;
        });
    });
});
