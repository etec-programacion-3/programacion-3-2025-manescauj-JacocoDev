import React from "react";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <HomePage />
      </main>
    </div>
  );
};

export default App;