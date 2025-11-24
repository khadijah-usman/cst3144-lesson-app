const { createApp } = Vue;

createApp({
  data() {
    return {
      lessons: [
        {
          id: 1,
          subject: "Mathematics",
          location: "Hendon",
          price: 100,
          spaces: 5,
          icon: "fa-solid fa-calculator",
          image: "https://img.icons8.com/color/240/calculator--v1.png"
        },
        {
          id: 2,
          subject: "English",
          location: "Colindale",
          price: 80,
          spaces: 5,
          icon: "fa-solid fa-book-open",
          image: "https://img.icons8.com/color/240/book-reading.png"
        },
        {
          id: 3,
          subject: "Biology",
          location: "Golders Green",
          price: 90,
          spaces: 5,
          icon: "fa-solid fa-seedling",
          image: "biology.png"
        },
        
        {
          id: 4,
          subject: "Chemistry",
          location: "Brent Cross",
          price: 70,
          spaces: 5,
          icon: "fa-solid fa-flask",
          image: "https://img.icons8.com/color/240/test-tube.png"
        },
        {
          id: 5,
          subject: "History",
          location: "Hendon",
          price: 50,
          spaces: 5,
          icon: "fa-solid fa-landmark",
          image: "https://img.icons8.com/color/240/scroll.png"
        },
        {
          id: 6,
          subject: "Physics",
          location: "Colindale",
          price: 95,
          spaces: 5,
          icon: "fa-solid fa-atom",
          image: "https://img.icons8.com/color/240/physics.png"
        },
        {
          id: 7,
          subject: "Art",
          location: "Brent Cross",
          price: 60,
          spaces: 5,
          icon: "fa-solid fa-palette",
          image: "https://img.icons8.com/color/240/art-prices.png"
        },
        {
          id: 8,
          subject: "Geography",
          location: "Golders Green",
          price: 85,
          spaces: 5,
          icon: "fa-solid fa-earth-europe",
          image: "https://img.icons8.com/color/240/globe--v1.png"
        },
        {
          id: 9,
          subject: "Computer Science",
          location: "Hendon",
          price: 120,
          spaces: 5,
          icon: "fa-solid fa-code",
          image: "https://img.icons8.com/color/240/source-code.png"
        },
        {
          id: 10,
          subject: "Economics",
          location: "Colindale",
          price: 110,
          spaces: 5,
          icon: "fa-solid fa-chart-line",
          image: "https://img.icons8.com/color/240/economic-improvement.png"
        }
      ],

      cart: [], // each item: { id, subject, location, price, image, quantity }
      showCart: false,
      searchTerm: "",
      sortBy: "subject",
      sortOrder: "asc",
      name: "",
      phone: "",
      orderConfirmed: false,
      nameError: "",
      phoneError: ""
    };
  },

  computed: {
    // Filters lessons based on search term (subject, location, price, spaces)
    filteredLessons() {
      const term = this.searchTerm.toLowerCase();

      return this.lessons.filter((l) => {
        const subject = l.subject.toLowerCase();
        const location = l.location.toLowerCase();
        const price = String(l.price).toLowerCase();
        const spaces = String(l.spaces).toLowerCase();

        return (
          subject.includes(term) ||
          location.includes(term) ||
          price.includes(term) ||
          spaces.includes(term)
        );
      });
    },

    // Sorts the filtered lessons by selected field and order
    sortedAndFilteredLessons() {
      return this.filteredLessons.slice().sort((a, b) => {
        const modifier = this.sortOrder === "asc" ? 1 : -1;
        if (a[this.sortBy] < b[this.sortBy]) return -1 * modifier;
        if (a[this.sortBy] > b[this.sortBy]) return 1 * modifier;
        return 0;
      });
    },

    // Validates name (letters only) and phone (8–15 digits)
    isFormValid() {
      const namePattern = /^[A-Za-z ]+$/;
      const phonePattern = /^[0-9]{8,15}$/; // 8–15 digits
      return namePattern.test(this.name) && phonePattern.test(this.phone);
    },

    // Total cost of the cart (price * quantity)
    cartTotal() {
      return this.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    // Total number of items in the cart (sum of quantities)
    cartItemCount() {
      return this.cart.reduce((count, item) => count + item.quantity, 0);
    }
  },

  methods: {
    // Adds a lesson to the cart (grouped by lesson, with quantity)
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        const existingItem = this.cart.find((item) => item.id === lesson.id);

        if (existingItem) {
          // Increase quantity of existing item
          existingItem.quantity++;
        } else {
          // Add new item to cart
          this.cart.push({
            id: lesson.id,
            subject: lesson.subject,
            location: lesson.location,
            price: lesson.price,
            image: lesson.image,
            quantity: 1
          });
        }

        // Decrease available spaces on the lesson
        lesson.spaces--;
      }
    },

    // Increase quantity from inside the cart (if spaces are available)
    increaseQuantity(index) {
      const cartItem = this.cart[index];
      const lesson = this.lessons.find((l) => l.id === cartItem.id);

      if (lesson && lesson.spaces > 0) {
        cartItem.quantity++;
        lesson.spaces--;
      }
    },

    // Decrease quantity; if quantity goes to 0, remove the item
    decreaseQuantity(index) {
      const cartItem = this.cart[index];
      const lesson = this.lessons.find((l) => l.id === cartItem.id);

      if (cartItem.quantity > 1) {
        cartItem.quantity--;
        if (lesson) {
          lesson.spaces++;
        }
      } else {
        // If quantity is 1, removing one more means removing the whole line
        this.removeFromCart(index);
      }
    },

    // Removes item from cart and restores all reserved spaces
    removeFromCart(index) {
      const cartItem = this.cart[index];
      const lesson = this.lessons.find((l) => l.id === cartItem.id);

      if (lesson) {
        lesson.spaces += cartItem.quantity;
      }

      this.cart.splice(index, 1);
    },

    // Validates form and shows success message + clears cart on success
    checkout() {
      this.nameError = "";
      this.phoneError = "";

      const namePattern = /^[A-Za-z ]+$/;
      const phonePattern = /^[0-9]{8,15}$/;

      if (!namePattern.test(this.name)) {
        this.nameError = "Name must contain letters only.";
      }
      if (!phonePattern.test(this.phone)) {
        this.phoneError = "Phone number must contain 8–15 digits.";
      }

      if (!this.nameError && !this.phoneError) {
        this.orderConfirmed = true;

        setTimeout(() => {
          // On successful order, we clear the cart and form.
          // Spaces are NOT restored here, because the order is confirmed.
          this.cart = [];
          this.name = "";
          this.phone = "";
          this.orderConfirmed = false;
        }, 1500);
      }
    },

    // Returns to the lessons view
    goHome() {
      this.showCart = false;
    }
  }
}).mount("#app");
