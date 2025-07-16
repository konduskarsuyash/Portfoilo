import { CommandResult } from '../types/terminal';

export class CommandProcessor {
  private commands = {
    help: this.showHelp,
    welcome: this.showWelcome,
    aboutme: this.showAbout,
    projects: this.showProjects,
    contact: this.showContact,
    email: this.emailRedirect,
    skills: this.showSkills,
    experience: this.showExperience,
    education: this.showEducation,
    clear: this.clearScreen,
    exit: this.exitTerminal,
    // Easter eggs
    whoami: this.whoAmI,
    sudo: this.sudo,
    ls: this.listFiles,
    pwd: this.printWorkingDirectory,
    date: this.showDate,
    uname: this.showSystem
  };

  async processCommand(command: string): Promise<CommandResult> {
    const [cmd, ...args] = command.split(' ');
    
    if (cmd in this.commands) {
      return await this.commands[cmd as keyof typeof this.commands].call(this, args);
    } else {
      return {
        type: 'error',
        content: `Command '${cmd}' not found. Type 'help' for available commands.`,
        animate: true
      };
    }
  }

  private async showHelp(): Promise<CommandResult> {
    return {
      type: 'output',
      content: `Available commands:

  welcome     - Display welcome message and ASCII art
  aboutme     - Learn about my background and experience
  projects    - View my portfolio projects
  skills      - Technical skills and expertise
  experience  - Professional work experience
  education   - Educational background
  contact     - Get in touch with me
  email       - Open your email client to contact me
  clear       - Clear the terminal screen
  exit        - Exit the terminal

Easter eggs:
  whoami, sudo, ls, pwd, date, uname

Type any command to get started!`,
      animate: true
    };
  }

private async showWelcome(): Promise<CommandResult> {
  const asciiArt = `
███████╗██╗   ██╗██╗   ██╗ █████╗ ███████╗██╗  ██╗
██╔════╝██║   ██║╚██╗ ██╔╝██╔══██╗██╔════╝██║  ██║
███████╗██║   ██║ ╚████╔╝ ███████║███████╗███████║
╚════██║██║   ██║  ╚██╔╝  ██╔══██║╚════██║██╔══██║
███████║╚██████╔╝   ██║   ██║  ██║███████║██║  ██║
╚══════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
`;

  const quote = `"Talk is cheap. Show me the code." – Linus Torvalds`;

  return {
    type: 'output',
    content: `<div class="ascii-art">${asciiArt}</div>

<span class="quote">${quote}</span>

Welcome to my portfolio. (Version 1.0.0)

Explore my:
- Professional Experience
- Technical Skills
- Projects
- Education
- Contact Information

Type 'help' to get started.`,
    animate: false
  };
}


private async showAbout(): Promise<CommandResult> {
  return {
    type: 'output',
    content: `<span class="section-header">About Suyash Santosh Konduskar</span>

<span class="role-title">👨‍💻 Software Developer</span>
<span class="location">📍 Virar/Mumbai</span>

<span class="about-text">Motivated and detail-oriented aspiring Backend Engineer with a strong foundation in computer 
science and problem-solving. Seeking to contribute to impactful projects at Grove as a 
Software Engineering Intern, while learning from real-world challenges in a fast-paced, 
collaborative environment.</span>

<span class="section-title">Professional Philosophy:</span>

<span class="philosophy-text">I believe in building <span class="highlight">scalable</span>, <span class="highlight">maintainable</span> systems that solve real-world
problems. My approach combines strong technical skills with a collaborative
mindset to deliver impactful solutions.</span>
`,
    animate: true
  };
}

private async showSkills(): Promise<CommandResult> {
  return {
    type: 'output',
    content: `<span class="section-header">Technical Skills</span>

<span class="skill-category">Core Skills:</span>
• <span class="skill-name">Data Structures & Algorithms</span> [|||||||||| <span class="skill-percent">90%</span>]
• <span class="skill-name">Object-Oriented Programming</span> [||||||||| <span class="skill-percent">85%</span>]
• <span class="skill-name">Operating Systems</span>           [||||||||| <span class="skill-percent">85%</span>]
• <span class="skill-name">DBMS</span>                        [|||||||||| <span class="skill-percent">90%</span>]
• <span class="skill-name">Computer Networks</span>           [||||||||| <span class="skill-percent">85%</span>]

<span class="skill-category">Programming Languages:</span>
• <span class="language">Java (DSA)</span>    [|||||||||| <span class="skill-percent">90%</span>]
• <span class="language">C</span>             [||||||||| <span class="skill-percent">80%</span>]
• <span class="language">Python</span>        [|||||||||| <span class="skill-percent">95%</span>]
• <span class="language">JavaScript</span>    [||||||||| <span class="skill-percent">85%</span>]

<span class="skill-category">Web Development:</span>
• <span class="web-tech">JavaScript</span>  [||||||||| <span class="skill-percent">85%</span>]
• <span class="web-tech">React.js</span>    [||||||||| <span class="skill-percent">80%</span>]
• <span class="web-tech">Node.js</span>     [||||||||| <span class="skill-percent">85%</span>]
• <span class="web-tech">Flask</span>       [|||||||| <span class="skill-percent">75%</span>]
• <span class="web-tech">Django</span>      [|||||||||| <span class="skill-percent">90%</span>]
• <span class="web-tech">FastAPI</span>     [|||||||||| <span class="skill-percent">90%</span>]
• <span class="web-tech">Spring Boot</span> [|||||||| <span class="skill-percent">75%</span>]
• <span class="web-tech">Docker</span>      [||||||||| <span class="skill-percent">80%</span>]

<span class="skill-category">Databases:</span>
• <span class="database">MySQL</span>       [|||||||||| <span class="skill-percent">90%</span>]
• <span class="database">PostgreSQL</span>  [||||||||| <span class="skill-percent">85%</span>]

<span class="skill-category">Tools:</span>
• <span class="tool">Git/GitHub</span>   [|||||||||| <span class="skill-percent">95%</span>]
• <span class="tool">Tableau</span>      [||||||||| <span class="skill-percent">80%</span>]

Type <span class="cmd-hint">help</span> to see other available commands.`,
    animate: true
  };
}

private async showProjects(): Promise<CommandResult> {
  return {
    type: 'output',
    content: `<span class="section-header">Projects</span>

<div class="project-group">
<span class="project-title">RetailAI - AI-powered Retail Analytics Platform</span>
<span class="tech-stack">Tech: FastAPI, Next.js, TensorFlow, React Native</span>
<span class="github-link">GitHub: <a href="https://github.com/konduskarsuyash/RetailAi" target="_blank">github.com/konduskarsuyash/RetailAi</a></span>
• Built an AI platform for real-time demand forecasting and smart outlet expansion
• Designed interactive maps to monitor outlet performance and recommend optimal locations
• Developed a React Native app with CRUD operations and personalized recommendations
</div>

<div class="project-group">
<span class="project-title">EY BPO - Business Process Optimization for BPOs</span>
<span class="tech-stack">Tech: FastAPI, Next.js, PostgreSQL, JWT auth, Whisper, NLP</span>
<span class="github-link">GitHub: <a href="https://github.com/konduskarsuyash/EY_BPO" target="_blank">github.com/konduskarsuyash/EY_BPO</a></span>
• Built an AI platform to automate claims handling and callbacks in Indian BPOs
• Integrated Whisper and NLP for real-time multilingual speech recognition
• Reduced callback times by 30-40% and improved client satisfaction by 25-35%
• Showcased at EY Techathon 5.0 with a live prototype and video
</div>

<div class="project-group">
<span class="project-title">AIRQI - AI-Driven Air Quality Prediction and Alerts</span>
<span class="tech-stack">Tech: React Native, Supabase, IoT, Gas Sensor V2, XGBoost</span>
<span class="github-link">GitHub: <a href="https://github.com/konduskarsuyash/AIRQI-IPD-" target="_blank">github.com/konduskarsuyash/AIRQI-IPD-</a></span>
• Developed a mobile app for real-time pollution tracking and asthma-specific health alerts
• Integrated with Supabase to fetch sensor data pushed every 15s
• Created live street-level AQI map with edge-cloud hybrid model predictions
</div>

<div class="project-group">
<span class="project-title">Restaurant Review API with NLP Analysis</span>
<span class="tech-stack">Tech: Django (DRF), NLP, Redis, Geolocation</span>
<span class="github-link">GitHub: <a href="https://github.com/konduskarsuyash/Restaurant_review_api_with_nlp_analysis" target="_blank">github.com/konduskarsuyash/Restaurant_review_api_with_nlp_analysis</a></span>
• Built a RESTful API that analyzes restaurant reviews using NLP sentiment analysis
• Developed a restaurant rating system and Top 5 ranking feature using Redis caching
</div>

Type <span class="cmd-hint">help</span> to see other available commands.`,
    animate: true
  };
}

private async showExperience(): Promise<CommandResult> {
  return {
    type: 'output',
    content: `<span class="section-header">Professional Experience</span>

<span class="job-title">Python Developer Intern</span> at <span class="company-name">JagranaTechCommunications</span>
<span class="job-duration">01/2024 - 03/2024</span>

• Migrated the entire codebase to <span class="tech-highlight">Python</span> in <span class="tech-highlight">Django</span>, enhancing scalability and maintainability
• Integrated class-based views and <span class="tech-highlight">DRF APIs</span>, enabling scalable dashboards

<span class="job-title">Full Stack Developer</span> at <span class="company-name">Caarya</span>
<span class="job-duration">Present</span>

• Developed and maintained backend systems for projects like Caarya Admin, AI-News, and Vajra using <span class="tech-highlight">TypeScript</span>, <span class="tech-highlight">Node.js</span>, <span class="tech-highlight">Express.js</span>, and <span class="tech-highlight">MongoDB</span>
• Designed and implemented <span class="tech-highlight">RESTful APIs</span>, handling user roles, access control, and data operations

Type <span class="cmd-hint">help</span> to see other available commands.`,
    animate: true
  };
}

private async showEducation(): Promise<CommandResult> {
  return {
    type: 'output',
    content: `<span class="section-header">Education</span>

<span class="education-item">B.tech in Computer Science Engineering (Data Science)</span>
<span class="institution-name">Dwarakadas J Sanghavi College Of Engineering</span>
<span class="education-date">2022 - 2025</span>
• Grade: <span class="grade-highlight">B- (7.32)</span>

<span class="education-item">HSC board</span>
<span class="institution-name">Vidyanidhi's Annasaheb Vartak College</span>
<span class="education-date">2020 - 2022</span>
• Percentage: <span class="grade-highlight">86%</span>

<span class="education-item">SSC board</span>
<span class="institution-name">Utkarsha Mandiayavik Vidyalaya</span>
<span class="education-date">2019 - 2020</span>
• Percentage: <span class="grade-highlight">94%</span>

<span class="section-title">Awards & Achievements:</span>
• <span class="award-highlight">🥇 1st Place</span> - Datason Datathon 2023 (Core ML)
  Ranked 1st among 55 teams (230 participants) at KJ Somaiya College
• <span class="award-highlight">🥉 6th Place</span> - KnowCode 2.0 2023
  Ranked 6th among 60 Teams at KJ Somaiya College of Engineering

<span class="section-title">Extra Curriculars:</span>
• Technical Department in <span class="highlight">DJSCE Compute</span>
• Conducted instructional sessions for 11th and 12th standard students

Type <span class="cmd-hint">help</span> to see other available commands.`,
    animate: true
  };
}

private async showContact(): Promise<CommandResult> {
  return {
    type: 'output',
    content: `<span class="section-header">Contact Information</span>

<span class="contact-category">📧 Email:</span> <a href="mailto:suyashkonduskar27@gmail.com" class="contact-link">suyashkonduskar27@gmail.com</a>
<span class="contact-category">📱 Phone:</span> <span class="contact-value">9322764396</span>
<span class="contact-category">📍 Location:</span> <span class="contact-value">Virar/Mumbai</span>

<span class="contact-category">💼 Professional Links:</span>
• <span class="platform">GitHub:</span> <a href="https://github.com/konduskarsuyash" target="_blank" class="contact-link">github.com/konduskarsuyash</a>
• <span class="platform">LinkedIn:</span> <a href="https://www.linkedin.com/in/suyash-konduskar-4b666b21b" target="_blank" class="contact-link">linkedin.com/in/suyash-konduskar-4b666b21b</a>
• <span class="platform">LeetCode:</span> <a href="https://leetcode.com/u/suyash_27/" target="_blank" class="contact-link">leetcode.com/u/suyash_27/</a>

Feel free to reach out for opportunities, collaborations, or just to chat about tech!
Type <span class="cmd-hint">email</span> to directly open your email client to contact me.`,
    animate: true
  };
}

  private async emailRedirect(): Promise<CommandResult> {
    // Open email client with pre-filled subject
    window.location.href = 'mailto:suyashkonduskar27@gmail.com';
    
    return {
      type: 'output',
      content: 'Opening email client...',
      animate: false
    };
  }

  private async clearScreen(): Promise<CommandResult> {
    return {
      type: 'clear',
      content: '',
      animate: false
    };
  }

  private async exitTerminal(): Promise<CommandResult> {
    return {
      type: 'exit',
      content: 'Goodbye! Thanks for visiting my portfolio.',
      animate: true
    };
  }

  // Easter eggs
  private async whoAmI(): Promise<CommandResult> {
    return {
      type: 'output',
      content: 'guest',
      animate: true
    };
  }

  private async sudo(): Promise<CommandResult> {
    return {
      type: 'output',
      content: 'Nice try! But you\'re already in my portfolio. No sudo needed here. 😄',
      animate: true
    };
  }

  private async listFiles(): Promise<CommandResult> {
    return {
      type: 'output',
      content: `total 8
drwxr-xr-x  2 suyash suyash 4096 Jul 15 10:30 projects/
drwxr-xr-x  2 suyash suyash 4096 Jul 15 10:30 experience/
drwxr-xr-x  2 suyash suyash 4096 Jul 15 10:30 skills/
drwxr-xr-x  2 suyash suyash 4096 Jul 15 10:30 education/
-rw-r--r--  1 suyash suyash  512 Jul 15 10:30 contact.txt
-rw-r--r--  1 suyash suyash  256 Jul 15 10:30 about.md`,
      animate: true
    };
  }

  private async printWorkingDirectory(): Promise<CommandResult> {
    return {
      type: 'output',
      content: '/home/guest/suyash-portfolio',
      animate: true
    };
  }

  private async showDate(): Promise<CommandResult> {
    return {
      type: 'output',
      content: new Date().toString(),
      animate: true
    };
  }

  private async showSystem(): Promise<CommandResult> {
    return {
      type: 'output',
      content: 'Portfolio Terminal v1.0.0 - Suyash Konduskar',
      animate: true
    };
  }
}