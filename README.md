# Enterprise-pro
     Requirement Specification Document



1.	Introduction:
Rakusens Food Manufacturer has a good track record. It is a company located in the city of Leeds, which is trying also to modernize production by introducing the new AI and Big Data technologies into the company. One of such projects that are specifically focused on this goal is the real-time interactive temperature monitoring dashboard that will also enable the operators to look at the monitoring sensor data and adjust production temperatures without wasting time in the process. Basically, the whole thing will improve product quality and energy efficiency by making evidence-based decisions. 
The actual functional and non-functional requirements for the project have been discussed in this document.
1.1.	Team Skills
The development team is needed to have skills related to web development and database management and API integration into real-time data processing/data visualization applications with authentication systems.
1.2.	Topic Rhetorization
In food manufacture, the live monitoring of temperature ensures the quality of the commodity production as well as the efficiency in the consumption of energy. This can be automated and visualized for the benefit of the production process optimally to save Rakusens time and money.
2.	Functional and Non Functional Requirements:
2.1 . Actors
  Three key user roles will constitute the system:
  • Administrator--handles user management and oversight of system operations.
  • Operator--monitors temperature data, reacts to alerts, and adjusts production       parameters.
  • Guest/User-who can view general trends and reports (when given permission to do so).
2.2 Functions Description
1. User Authentication System
        o Users must have a secure login mechanism using their unique credentials.
        o Password reset functionality should always be present.
2. Retrieval of Sensor Data
         o APIs shall be developed to automatically pull and parse out temperature data from the SQL database.
         o APIs should support the quest for data against a date range, sensor Id, and status. 
3. Real-time Visual Data Representation
         o An interactive dashboard should provide temperature data visually.
         o The image should be done with free open-source libraries (like Plotly.js, for instance). 
4. Traffic Light Alert System
          o Adopt a color-coded alert system through which temperature abnormalities are notified.
          o A pre-existing Machine Learning model shall be used to identify outliers and raise the alerts when needed. 
5. Responsive Web Design
          o The dashboard must be made accessible through a desktop, tablet, or mobile.
          o Responsive framework tools can be used so that the UI adapts (Bootstrap, Tailwind      CSS, etc.) 
6. Data Aggregation & Statistics
          o Allow users to filter and group their data by sensor ID, time range, and status.
          o Provide statistical summaries such as average temperatures with minimum and maximum readings and variance. 
7. Real-time Data Update
          o Real-time updates of the visual data must be provided through WebSockets or polling. 
         o Updates with the least latency should be ensured for accurate monitoring. 
8. User Management
          o An administrator should be able to create, update, and delete user accounts. 
          o Role-based access control (RBAC) ensures that adequate permissions are enforced.
2.3. Non functional requirements:
• Performance: It should perform efficiently on a large scale of sensor data.
• Security: All user data would need to be encrypted; secured APIs must need to be enforced. 
• Scalability: Supporting additional sensors and data sources is planned for the future.
• Usability: The dashboard should be easy and intuitive to use.
3. Data Description:
3.1 Sensor Data:
• Sensor-ID Unique to each sensor.
• Temperature data is drawn in Celsius.
• Timestamp: Moment of Reading Taken.
• Status: Normal, Warning, or Critical (depending on alert system).
3.2 User Data:
• User-ID Unique identifier.
• Username Credential to login.
• Password Encryption store.
• Role Administrator, Operator, or Guest.
3.3 Alerts:
• Alert-ID Unique identifier.
• Sensor ID that alerts the triggering sensor.
• Alert Level: Warning or Critical.
• Timestamp: Time at which the alert was triggered.
4.Interface
The system aims to keep an ergonomic design with the following components:
1.	Login Page  It will allow an effective login for users with security.
2. Dashboard  It shows temperature data in real time.
3. Sensor Management  Admins can manage sensors.
4. User Management  Admins can create and alter user accounts.
5. Reports & Analytics  This section generates historical data and insights.
6. Alerts Page  It shows identified data points with recommendations for a fix.
5. LSEPI and Risk Assessment:
• Legal: GDPR compliance with regard to user data privacy.
• Social: Ensures food safety and production efficiency.
• Ethical: Prevents human error regarding temperature control. 
• Professional: The industry best practices in the field of software development are to be followed.
• Risk Mitigation: It provides technology to counteract data generated through wrong sensor readings.
6. Work Plan
A structured timeline using Gantt should include:
• Database setup
• API development 
• Frontend UI implementations 
• Data visualization 
• Authentication and security 
• Testing and deployment
7. GitHub
• Source code repository. 
• Minutes of meetings documentation. 
• Version control track.





