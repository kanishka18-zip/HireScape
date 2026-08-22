import json

with open('jobs_data.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

cleaned_jobs = []
for job in jobs:
    cleaned_jobs.append({
        "title": job.get("internship_title", "Untitled Internship"),
        "company": job.get("company_name", "Company not specified"),
        "location": job.get("location", "Location not specified"),
        "stipend": job.get("stipend", "Not disclosed"),
        "skills": job.get("required_skills", [])
    })

with open('data.js', 'w', encoding='utf-8') as f:
    f.write("const jobsData = ")
    json.dump(cleaned_jobs, f, indent=2)
    f.write(";")

print(f"Done! Processed {len(cleaned_jobs)} internships into data.js")