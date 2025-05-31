import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages";
import NotFound from "@/pages/not-found";
import { Helmet } from 'react-helmet';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <title>CoffeeCompass - Find Coffee Shops, Restaurants, and Bars Nearby</title>
        <meta name="description" content="Discover coffee shops, restaurants, and bars near you with CoffeeCompass. Filter by venue type and find detailed information including ratings, opening hours, and contact details." />
        <meta property="og:title" content="CoffeeCompass - Find Coffee Shops, Restaurants, and Bars Nearby" />
        <meta property="og:description" content="Discover coffee shops, restaurants, and bars near you with CoffeeCompass. Interactive map and venue details at your fingertips." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb" />
      </Helmet>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
