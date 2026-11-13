document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêcher l'envoi du formulaire par défaut

    // Récupérer les valeurs des champs du formulaire
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const messageValue = document.getElementById("message").value;
  const subject = document.getElementById("subject").value;
    // Zone pour afficher le statut
    const statusEl = document.getElementById("form-status");

    // Utilisation de Formspree pour envoyer l'email
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", messageValue);
      formData.append("subject", subject);

    fetch("https://formspree.io/f/mwpqjapz", {
        method: "POST",
        body: formData, 
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur de requête");
        }
        return response.json();
    })
    .then(data => {
        // ✅ Show confirmation message
        statusEl.textContent = "✅ Message envoyé avec succès";
        statusEl.className = "mt-4 text-center text-green-600 font-medium";

        // ✅ Clear the form fields
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
         document.getElementById("subject").value = "";

        // ✅ Effacer le message après 5s
        setTimeout(() => {
            statusEl.textContent = "";
        }, 5000);
    })
    .catch(error => {
        console.error("Erreur d'envoi du message", error);
        statusEl.textContent = "❌ Une erreur s'est produite. Veuillez réessayer.";
        statusEl.className = "mt-4 text-center text-red-600 font-medium";

        // ✅ Effacer le message après 5s
        setTimeout(() => {
            statusEl.textContent = "";
        }, 5000);
    });
});
