# Resilio - Crisis Management System

## Members of the Pathfinders
- Marc Mahler, 23-726-276
- Janosch Beck, 23-731-011
- Jarno Bucher, 23-700-115

## Task distribution:
#### Marc 
- Concept designer
- Stakeholder Analyst
- _Figma Make_ specialist, handling the Frontend design with the modern tool _Figma Make_
- **Report:** Analysis (Evaluation of the final solution, Critical Incidents Analysis, Impact on the team), Reflection, Conclusion

#### Janosch Beck
- Team Leader
- Screen for the Crisis Magament Staff Leader
- Set up infrastructure for BE and some sample Endpoints
- **Report:** ProblemStatement and Motivation, Solution design & fit to the GaaP concept, Approach
  
#### Jarno
- UI-Designer
- ⁠Set up framework for Web-Application
- **⁠Report:** Incident Catalogue, Partner/Users Interviews and Peer Interviews summaries

## Challenge Description
In times of crisis, the City of Zurich must respond quickly to provide accommodation and essential goods for those in need. The AOZ (Asylorganisation Zürich) plays a central role in supporting newly arriving refugees, yet the organization often faces uncertainty about how many people will arrive and what specific resources are required.

Currently, crisis management teams coordinate mainly through personal phone calls, informal communication, and scattered data sources. Each department maintains its own storage and supply records, which makes it difficult to obtain a reliable overview of available goods. This lack of visibility leads to duplicated work, unnecessary purchases, and delayed decisions during moments when speed and clarity are crucial.

A concrete example from AOZ illustrates the problem: during one emergency, the crisis team bought every available bed from IKEA, unaware that several city departments still had unused beds in storage.
The challenge, therefore, was to create a unified and transparent system that connects all relevant actors, giving them immediate access to accurate information about stock levels, availability, and responsibilities—ultimately improving coordination, reducing waste, and easing decision-making under pressure.

## Solution Description
Our team developed Resilio, a concept for a centralized crisis management platform that connects all departments involved in emergency response.
Resilio enables crisis teams to gain a clear overview of available goods and resources across the city, request what they need quickly, and make informed decisions without relying on fragmented knowledge.

The platform is built around three clearly defined user roles:
	•	Crisis Management Staff – view and request available items such as beds, blankets, or supplies. The interface focuses on simplicity and ensures users can find and request items in just a few clicks.
	•	Crisis Management Lead – reviews and prioritizes incoming requests, ensuring resources are distributed fairly and efficiently across all departments.
	•	Maintainers – manage inventory data and update storage information, ensuring that all shared resources remain visible and reliable for everyone involved.

Resilio’s goal is to make crisis response more transparent, efficient, and collaborative.
By providing one shared space for all critical information, the system reduces stress, minimizes redundant work, and allows the City of Zurich to act faster and smarter when it matters most.

The system features a clean, intuitive interface optimized for high-stress situations with quick access to critical information and emergency contacts.

## Tech Stack
- **Frontend**: React + TypeScript, Vite
- **UI Components**: shadcn/ui, Lucide React icons
- **Routing**: Client-side navigation with context management
- **State Management**: React Context API with localStorage persistence
- **Backend** Node
