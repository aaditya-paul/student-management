# Project Report On
# Student/College Management System

#
#



Submitted by      

Aaditya Paul (D232407598	)

Piyush Dutta (D232427580)

Ankit Singh(D232407573)

Sreya Kangsabanik (D232407581)

Abhishek Saha (D232407575)


# Under the guidance of
Shri/Smt.

Designation

Dept of Computer Science & Technology

`      `Central Calcutta Polytechnic












## Department of Computer Science and Technology
# Central Calcutta Polytechnic
## 21, Convent Road, Kolkata-14, WB
##
## ***Certificate of Approval***

This is to certify that this report of Second Year minor project, entitled **“Student Management System”** is a record of bona-fide work, carried out by **Aaditya Paul, Piyush Dutta, Ankit Singh, Sreya Kangsabanik, Abhishek Saha** under my supervision and guidance.

In my opinion, the report in its present form is in partial fulfillment of all the requirements, as specified by the ***Central Calcutta Polytechnic*** and as per regulations of the ***West Bengal State Council of Technical & Vocational Education and Skill Development***. In fact, it has attained the standard, necessary for submission. To the best of my knowledge, the results embodied in this report, are original in nature and worthy of incorporation in the present version of the report for second year minor project in Computer Science and Technology in the year 2024-2025.




**Guide / Supervisor**

**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**Shri/Smt.**

Department of Computer Science and Technology

Central Calcutta Polytechnic



\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Head of the Department**

Department of Computer Science and Technology

Central Calcutta Polytechnic
### **ACKNOWLEDGEMENT**



It is with a deep sense of gratitude and respect that I take this opportunity to express my sincere thanks to all those who have contributed to the successful completion of my final year project titled **"Student Management System"**. This project has been a significant learning experience and a milestone in my academic journey.

First and foremost, I am profoundly grateful to my esteemed guide, **Shri./Smt. [Guide Name]**, of the Department of Computer Science and Technology, Central Calcutta Polytechnic, for their constant support, valuable suggestions, and expert guidance throughout the course of this project. Their unwavering encouragement, critical insights, and meticulous attention to detail helped me understand complex concepts and overcome technical challenges with clarity and confidence. The constructive criticism provided by my guide not only improved the quality of my project but also shaped my problem-solving abilities and approach to software development.

I would also like to extend my heartfelt appreciation to the **Head of the Department** and all the faculty members of the Department of Computer Science and Technology for providing me with the necessary infrastructure, academic resources, and moral support during the course of this project. Their constant encouragement and enthusiasm created a healthy academic environment that motivated me to perform my best.

A special mention must be made of my classmates and friends, whose collaboration and thoughtful discussions throughout the academic year helped me stay motivated. Their support, both technically and emotionally, was instrumental in managing the multiple stages of project development, testing, and presentation.

I would also like to express my sincere thanks to my **family members**, who have been a constant pillar of support throughout my education. Their patience, love, and encouragement enabled me to remain focused and determined even during stressful times.

Lastly, I acknowledge the contribution of various open-source communities and documentation platforms like **GitHub**, **Firebase Docs**, **ReactJS Docs**, and others whose vast and freely accessible resources guided me during the development process and allowed me to expand my technical knowledge.

This project has been a valuable experience that not only enhanced my technical and analytical skills but also taught me the importance of persistence, collaboration, and self-learning. I am truly thankful to everyone who has played a role in this endeavour.

**Aaditya Paul**

**(D232407598)**

**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**PROJECT SYNOPSIS**


The **Student Management System** is a web-based project developed to simplify and improve the day-to-day administrative tasks of educational institutions. The main goal of this system is to help colleges manage students, teachers, timetables, attendance, notices, and internal communication / global chat in a more organized and efficient way.

In many colleges, important tasks such as keeping track of student records, managing teacher schedules, taking attendance, and posting announcements are done manually or using separate tools. This often leads to confusion, duplication of work, and difficulty in communication. Our project aims to solve this problem by combining all these features into one single platform.

The system allows administrators to add and manage both student and teacher data, set timetables, take and view attendance, and share notices in real-time. Teachers can check their schedules and update attendance, while students can view their assigned subjects, notices, and more. This creates better collaboration and transparency between all members of the institution.

We used modern web technologies like **React.js, Next.js, TailwindCSS**, and **Firebase** to build this full-stack application. The interface is user-friendly and responsive, meaning it works well on both desktop and mobile devices. This system is especially helpful for institutions looking to reduce paperwork, save time, and improve overall communication and management.

In the future, this project can be expanded with features like report generation, fee tracking, or integration with other academic systems.













**CONTENTS**

**CHAPTER 1	INTRODUCTION    						  1**

1. **Objective2**
1. **Scope of the System3**
1. **Feasibility Study							  4**
   1. **Technical Feasibility 						  5**
   1. **Operational Feasibility                                                              6**
   1. **Economic Feasibility                                                                 7**

**CHAPTER 2	SOFTWARE REQUIREMENT SPECIFICATION (SRS)	  8**

**CHAPTER 3	SOFTWARE DEVELOPMENT PROCESS MODEL ADOPTED 9**

**CHAPTER 4	OVERVIEW**

1. **System Overview**
   1. **Limitation of Existing System**
1. **Proposed System**
   1. **Objectives of the proposed system** 
   1. **Users of the Proposed system**

**CHAPTER 5	ASSUMPTION AND DEPENDENCIES**

**CHAPTER 6	TECHNOLOGIES**

1. **Tools used in Development**
1. **Development Environment**
1. **Software Interface**
1. **Hardware Used**

**CHAPTER 7	DESIGN**

1. **Data Flow Diagram**
1. **Entity Relationship Diagram**

**CHAPTER 8	DATA DICTIONARY**

**CHAPTER 9 TESTING**

1. **Unit Testing**
1. **Integrity Testing**

**CHAPTER 10 SNAPSHOTS**

**CHAPTER 12 CONCLUSION and FUTURE SCOPE				70**

**CHAPTER 11 REFERENCES							72**
**2 **|** Page


**1.				INTRODUCTION**

**	Educational institutions manage a large amount of data related to students, teachers, schedules, and attendance. Handling all of this manually is often time-consuming, error-prone, and inefficient. The Student Management System aims to provide a centralized digital platform to automate and streamline these processes. By integrating core features like student records, teacher data, timetable management, attendance tracking, and notices, the system makes college administration easier and more effective.

1. **Objective:**

The main objectives of the project are:

- To develop a system that allows administrators to add, update, and delete student details.
- To provide a user-friendly interface for managing student records, managing teacher records, viewing metrics important to students/teachers/admin.
- To ensure data persistence using a robust backend (Firebase).

1. **Scope of the system:**

The Student Management System is designed primarily for small to medium-sized educational institutions. It allows the admin to:

- Add new students along with relevant academic details.
- Update or delete existing student information.
- Maintain a consistent and organized UI with clear forms and validations.
- Add Notices
- Manage/View Timetables
- Manage/View Attendance
- Edit/View Profile
- Global Chat for communication.

**1.3 Feasibility Study**

**1.3.1 Technical Feasibility**

The project is technically feasible as it uses well-documented technologies:

- Frontend: NextJS and ReactJS for a responsive user interface
- Backend: NextJS API Route
- Database: Firebase Firestore
- Hosting: Vercel

**1.3.2 Operational Feasibility**

Operationally, the system is easy to use and maintain. The GUI is intuitive, and minimal training is required for users. As it runs on web browsers, it eliminates the need for installation and works across different devices.

**1.3.3 Economic Feasibility**

The system is economically feasible since all the tools and technologies used are free and open-source. No commercial software or infrastructure is required, making it an affordable solution for institutions with limited budgets.


**Captions of figures** should appear below the figure, in 10 pts and Times New Roman and a sample is as given below:  


![ref1]














Fig. X.Y : Name of the figure.

**X.Y** stands for, X being chapter no and Y serial number of the figure in this chapter. The figure should be reference properly in the text. If it is a **graph** then also follow the same format, but the lines of line graphs should not exceed 5 points.







**Captions of the tables** must appear above the Tables, in 10 pts and Times New Roman and a sample is as given below: 

Table – X.Y : Table details.


![ref1]















**2.	 	 Software Requirement Specification (SRS)**

**2.1 Functional Requirements**

- Admin can add new students with name, registration number, semester, department and contact details.
- Admin can edit or delete student records.
- Admin can add new teacher with name, department, semester, and contact details.
- Admin can set timetables, and manage attendance.
- Admin can set high priority notices.
- Admin can participate in global chat.
- Teacher can add new students with name, registration number, semester, department and contact details.
- Teacher can set timetables, and manage attendance.
- Teacher can set notices.
- Teacher can participate in global chat.
- Student Can View Attendance and timetable and notices.
- Students can participate in global chat.


**2.2 Non-functional Requirements**

- It shall store data securely in Firebase Firestore database.
- It should be scalable and maintainable.

**2.3 System Requirements**

- Node.js
- Firebase
- NextJS
- React.js
- Browser with modern JS support

**3.	Software Development Process Model Adopted**

The software development for this project rigorously followed the **Agile Model**, proving highly effective. We developed the system in small, iterative cycles, with each delivering a specific, functional piece, making complex features manageable. A key benefit was **continuous integration and testing**, where code was integrated and tested immediately, preventing defect accumulation and ensuring codebase stability. This iterative nature also facilitated continuous **UI refinement** through early feedback, leading to a user-friendly interface. Furthermore, Agile significantly helped in **validating functional flows** incrementally, ensuring features worked as intended. Finally, small, focused iterations made **debugging logic incrementally** much more manageable, isolating issues to recent code changes. This systematic approach improved the overall software **quality** and significantly reduced the **turnaround time** for delivery.

![What Is Agile Methodology? (A Beginner's Guide) • Asana](Aspose.Words.e8dd0a4c-6c9e-4ad4-aa1b-42752fe33479.002.jpeg)


**4.				        Overview**

**4.1 System Overview**

The Student Management System is a full-stack MERN web application. The frontend is built with React, enabling dynamic rendering of components and stateful interactions. Firebase Firestore is used as the NoSQL database.

**4.1.1 Limitations of the Existing System**

- Manual handling of student data
- Error-prone and inefficient
- No central record management
- Time-consuming to search and update records

**4.2 Proposed System**

A digital, responsive student record system with CRUD operations.

**4.2.1 Objectives of the Proposed System**

- Improve accessibility of student data
- Ensure quick update and deletion
- Reduce human error

**5.		   Assumptions and Dependencies**

- Assumes that the user has basic knowledge of using a web app.
- Assumes that Firebase is Configured.
- Assumes deployment servers are stable.
- Depends on React, Nextjs, Firebase, and Node.js versions being compatible.

**6.				 Technologies**

**6.1 Tools Used**

- Visual Studio Code
- Git & GitHub
- Google Chrome
- Redux Extension Toolkit

**6.2 Development Environment**

- OS: Windows/Linux
- Browser: Chrome
- Framework: MERN Stack

**6.3 Software Interface**

- Frontend: React
- Backend: None
- DB: Firebase

**6.4 Hardware Used**

- Intel i5
- 8GB RAM
- Stable internet connection

**7.				      Design**

**7.1 Data Flow Diagram (DFD)**

**(Insert DFD here using draw.io)**

**7.2 Entity Relationship Diagram (ERD)**

**(Insert ER diagram here showing Student entity with fields like id, name, semester)**


**8.				Data Dictionary**












**9.				    Testing**

**9.1 Unit Testing**

Each component was tested independently:

- Form validation
- API communication
- State updates

**9.2 Integration Testing**

Tests were performed to ensure:

- Frontend correctly integrates with Database.
- All CRUD operations reflect on UI and DB

**10.				   Snapshots** 

- Home Page

  ![](Aspose.Words.e8dd0a4c-6c9e-4ad4-aa1b-42752fe33479.003.png)

- Student Login
- Teacher Login
- Add Student Form
- Student List
- Edit/Delete Functionality




**11.			Conclusion and Future Scope**

The Student Management System was successfully developed using the MERN stack. It simplifies the task of managing student data with a clean and responsive interface.

Future Enhancements:

- Export reports as PDF
- Add attendance & marks module
- Notifications and dashboard


**Reference**

1. **ReactJS Docs - [https://reactjs.org/docs/getting-started.html**](https://reactjs.org/docs/getting-started.html)**
1. **NodeJS Docs - [https://nodejs.org/en/docs/**](https://nodejs.org/en/docs/)**
1. **Firebase Docs - [https://firebase.google.com/docs/**](https://firebase.google.com/docs/)**
1. **GitHub Repo - [https://github.com/aaditya-paul/student-management**](https://github.com/aaditya-paul/student-management)**
1. **Deployment - [https://student-management-umber-ten.vercel.app/**](https://student-management-umber-ten.vercel.app/)**



















**APPENDIX-A**
**\
















**VERY INPORTANT:** ANY DEVIATION IN INSTRUCTIONS / FORMATTING WILL INVITE REJECTION OF THE REPORT IN TOTAL.

[ref1]: Aspose.Words.e8dd0a4c-6c9e-4ad4-aa1b-42752fe33479.001.png
