AFRAME.registerComponent("markerhandler",{
    init: async function() {
        this.el.addEventListener("markerFound", ()=>{
            console.log("Se encontró el marcador");
            this.handlerMarkerFound();
        }),
        this.el.addEventListener("markerLost", ()=> {
            console.log("Se perdió el marcador");
            this.handlerMarkerLost();
        })
    },
    handlerMarkerFound: function(){
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "flex";

        var orderButton = document.getElementById("order-button");
        var orderSummaryButton = document.getElementById("order-summary-button");

        orderButton.addEventListener("click", () => {
            swal({
                icon: "",
                title: "¡Gracias por tu orden!",
                text: "",
                timer: 2000,
                buttons: false
            });
        });

        orderSummaryButton.addEventListener("click", () => {
            swal({
                icon: "warning",
                title: "Resumen de la orden",
                text: "Operacion en curso",
            });
        });
        
    },
    handleMarkerLost: function () {
        
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "none";
    },
    getAllToys: async function(){
        return await firebase
          .firestore()
          .collection("toys")
          .get()
          .then(snap => {
            return snap.docs.map(doc => doc.data());
          });
    },
    handleOrder: function (uid, toy) {
        
        firebase
          .firestore()
          .collection("users")
          .doc(tNumber)
          .get()
          .then(doc => {
            var details = doc.data();
    
            if (details["current_orders"][toy.id]) {
              
              details["current_orders"][toy.id]["quantity"] += 1;
    
              
              var currentQuantity = details["current_orders"][toy.id]["quantity"];
    
              details["current_orders"][dish.id]["subtotal"] =
                currentQuantity * toy.price;
            } else {
              details["current_orders"][dish.id] = {
                item: toys.toys_name,
                price: toy.price,
                quantity: 1,
                subtotal: toy.price * 1
              };
            }
    
            details.total_bill += toy.price;
    
            
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update(details);
          });
      }, 
      askUserld: function () {
        var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
        swal({
          title: "¡¡Bienvenido!!",
          icon: iconUrl,
          content: {
            element: "input",
            attributes: {
              placeholder: "Escribe tu juguete",
              type: "array",
              min: 1
            }
          },
          closeOnClickOutside: false,
        }).then(inputValue => {
            toys_name = inputValue;
          });
        },

        getorderSummary: async function(uid){
          return await firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => doc.data());
        }

        handlerOrderSummary: async function (){
          var modalDiv = document.getElementById("modal-div");
          modalDiv.style.display = "flex";

          uid = uid.toUpperCase();

          var orderSummary = await this.getOrderSummary(uid)

          var tableBodyTag = document.getElementById("bill-table-body");

          tableBodyTag.innerHTML = "";

          var currentOrders = Object.keys(orderSummary.current_orders);

          currentOrders.map(i => {
            var tr= document.createElement("tr");
            var item = document.createElement("td");
            var price = document.createElement("td");
            var quantity = document.createElement("td");
            var subtotal = document.createElement("td");

            item.innerHTML = orderSummary.current_orders[i].item;
            price.innerHTML = "$" + orderSummary.current_ordes[i].price;
            price.setAttribute("class", "text-center");

            quantity.innerHTML = orderSummary.current_orders[i].quentity;
            quantity.setAttribute("class", "text-center");

            subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
            subtotal.setAttribute("class", "text-center");

            tr.appendChild(item);
            tr.appendChild(price);
            tr.appendChild(quantity);
            tr.appendChild(subtotal);
            tableBodyTag.appendChild(tr);
          })
        }
})