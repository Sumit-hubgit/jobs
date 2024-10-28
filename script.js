const jobForm = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const JOBS_KEY = "jobs";
const DELETE_PASSWORD = "delete123"; // Hardcoded delete password

// Load jobs from local storage on startup
document.addEventListener("DOMContentLoaded", loadJobs);

jobForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const jobTitle = document.getElementById("jobTitle").value;
    const jobDescription = document.getElementById("jobDescription").value;
    
    const newJob = {
        id: Date.now(),
        title: jobTitle,
        description: jobDescription,
        postedAt: Date.now()
    };
    
    saveJob(newJob);
    addJobToDOM(newJob);
    jobForm.reset();
});

// Function to save job to local storage
function saveJob(job) {
    const jobs = getJobs();
    jobs.push(job);
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

// Function to load jobs from local storage
function loadJobs() {
    const jobs = getJobs();
    jobs.forEach(addJobToDOM);
    removeExpiredJobs();
}

// Function to add job to the DOM
function addJobToDOM(job) {
    const jobItem = document.createElement("li");
    jobItem.className = "job-item";
    jobItem.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.description}</p>
        <p><small>Posted on: ${new Date(job.postedAt).toLocaleDateString()}</small></p>
        <button class="delete-btn" onclick="confirmDeleteJob(${job.id})">Delete</button>
    `;
    jobList.appendChild(jobItem);
}

// Function to get jobs from local storage
function getJobs() {
    return JSON.parse(localStorage.getItem(JOBS_KEY)) || [];
}

// Function to confirm and delete a job by ID
function confirmDeleteJob(jobId) {
    const password = prompt("Enter password to delete this job:");
    if (password === DELETE_PASSWORD) {
        deleteJob(jobId);
        alert("Job deleted successfully!");
    } else {
        alert("Incorrect password. Job not deleted.");
    }
}

// Function to delete a job by ID
function deleteJob(jobId) {
    let jobs = getJobs();
    jobs = jobs.filter(job => job.id !== jobId);
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    jobList.innerHTML = '';
    jobs.forEach(addJobToDOM);
}

// Function to remove expired jobs after 1 week
function removeExpiredJobs() {
    const jobs = getJobs();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const currentTime = Date.now();

    const updatedJobs = jobs.filter(job => (currentTime - job.postedAt) < oneWeekInMs);
    
    if (updatedJobs.length !== jobs.length) {
        localStorage.setItem(JOBS_KEY, JSON.stringify(updatedJobs));
        jobList.innerHTML = '';
        updatedJobs.forEach(addJobToDOM);
    }
}
