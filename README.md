# 🌪️ Disaster Relief Resource Management System (ReliefOps)

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</div>

<br />

## 🚀 Live Deployment
> **[Click here to view the Live Project!](https://reliefops-kappa.vercel.app)**

Deployment details: [Vercel Inspect](https://vercel.com/riddhimagangwar9-5744s-projects/reliefops/3Rhu2P3o1AiCamCFXDELHDPB35x7)

## 📝 Overview & Context
ReliefOps is a high-performance command platform tailored for managing relief resources during natural disasters. Developed as an interactive **Mission Control Center**, the platform leverages essential **Data Structures and Algorithms (DSA)** to solve real-world logistical challenges.

It demonstrates the practical application of algorithms by automating resource allocation and visualizing execution metrics, such as time complexity and step-by-step processing. This project is ideal for both operational disaster management simulation and interactive algorithmic learning.

### 🔥 Core Features
- **Live Command Dashboard**: Real-time telemetry feed of system events, active operations, and overall relief metrics.
- **Automated Resource Allocation**: Utilizes advanced algorithms (e.g., **Quick Sort**, **Binary Search**) to efficiently locate, rank, and dispatch the most relevant emergency supplies based on proximity and urgency.
- **Mission Replay & Visualizer Engine**: Visually trace the step-by-step algorithmic execution of every emergency response mission, including time complexity analysis (O(N), O(N log N)) and interactive graph tools.
- **Educational DSA Labs**: Dedicated labs and visualizers for users to explore and learn exactly how sorting and searching algorithms perform under different conditions.
- **Interconnected Workflow**: Centralized global state that ensures all pages (Inventory, Reports, Centers, Requests) update immediately when a relief mission is executed.

## 🧠 Data Structures and Algorithms (DSA) Implementation
As a DSA-centric project, ReliefOps utilizes classic algorithms not just for theoretical demonstration, but to drive the core logic of the Mission Control Center. 

### 🔍 Searching Algorithms
- **Binary Search [O(log N)]**: Deployed to rapidly scan through sorted inventory and relief center databases. It ensures that critical supplies (e.g., medical kits, water) can be located with maximum efficiency, especially during high-stress operations when the resource list grows massive.
- **Linear Search [O(N)]**: Used as a fallback mechanism for unsorted emergency requests and logs where continuous data append occurs in real-time, allowing immediate scanning without requiring a pre-sort step.

### 📊 Sorting Algorithms
- **Quick Sort [O(N log N)]**: The primary sorting engine behind the Automated Resource Allocation. When a disaster strikes, available relief centers and resources are instantly ranked based on a composite score of proximity, urgency, and resource availability to determine the optimal dispatch route.
- **Merge Sort [O(N log N)]**: Implemented for stable sorting of comprehensive historical disaster reports, ensuring that records with identical timestamps remain in their original chronological order during analytical reviews.
- **Bubble, Insertion, and Selection Sorts [O(N²)]**: Integrated specifically within the **Educational DSA Labs** and **Mission Replay Visualizer**. Users can select these algorithms to observe their step-by-step execution, comparing their real-time performance and algorithmic overhead against the optimized O(N log N) approaches.

### 📈 Algorithmic Telemetry & Visualization
The platform features a **Search Analytics** and **Performance Graph** system that tracks the real-time execution metrics of the algorithms. It records the number of operations, comparisons, and time elapsed, providing an educational and transparent view into the time complexities in action.

## 🏗️ Project Architecture
The source code is structured as a modern React application:

- `src/algorithms/`: Core implementation of essential algorithms.
  - **Searching**: Binary Search, Linear Search
  - **Sorting**: Bubble Sort, Insertion Sort, Merge Sort, Quick Sort, Selection Sort
- `src/pages/`: Main application views.
  - `Dashboard`: The Mission Control Center.
  - `ResourceManagement` / `ResourceAllocation`: Inventory and dispatch logic.
  - `DisasterRequests` / `ReliefCenters`: Managing incoming emergency signals and dispatch hubs.
  - `LearnAlgorithms` / `SearchVisualizer` / `SortingVisualizer`: Educational DSA visualizations.
  - `Reports` / `SearchAnalytics`: Mission logging and algorithmic telemetry.
- `src/components/`: Reusable UI elements, including 3D Canvas visualizers.
- `src/context/`: Global state management.

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Framer Motion, Phosphor Icons, Lucide React
- **Visualization & 3D**: Recharts, Three.js, React Three Fiber, GSAP
- **State Management**: React Context API

## 💻 Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```
