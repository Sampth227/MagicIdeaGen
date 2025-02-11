const ideas = {
    history: [
        "The Untold Story of the Great Fire of London",
        "How the Roman Empire Changed the World",
        "The Secret History of the Samurai"
    ],
    motivational: [
        "How to Overcome Fear and Achieve Your Dreams",
        "Morning Habits of Highly Successful People",
        "The Power of Positive Thinking Explained"
    ],
    kids: [
        "10 Fun Science Experiments for Kids",
        "The Story of the Solar System in 5 Minutes",
        "How Dinosaurs Lived: Fun Facts for Kids"
    ],
    fun_facts: [
        "Weird But True: Strange Facts You Didn't Know",
        "The Most Bizarre World Records Ever Set",
        "Crazy Coincidences That Will Blow Your Mind"
    ]
};

document.getElementById("generateBtn").addEventListener("click", function() {
    let category = document.getElementById("category").value;
    let ideaList = ideas[category];
    let randomIdea = ideaList[Math.floor(Math.random() * ideaList.length)];
    document.getElementById("ideaOutput").innerText = "Video Idea: " + randomIdea;
});

document.getElementById("themeToggle").addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
    this.innerText = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

document.getElementById("copyIdea").addEventListener("click", function() {
    let text = document.getElementById("ideaOutput").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Idea copied to clipboard!");
    });
});

document.getElementById("shareIdea").addEventListener("click", function() {
    let text = document.getElementById("ideaOutput").innerText;
    let url = encodeURIComponent(window.location.href);
    let shareText = encodeURIComponent(text);
    let twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${url}`;
    window.open(twitterUrl, "_blank");
});
