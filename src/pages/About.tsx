import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Globe, Users, Target, Heart } from "lucide-react";

const values = [
  { icon: Globe, title: "Africa-First", description: "Built in Africa, for Africa, with global relevance. Our data and solutions prioritize the continent's unique challenges." },
  { icon: Users, title: "Open & Inclusive", description: "Environmental data should be accessible to everyone — from smallholder farmers to international researchers." },
  { icon: Target, title: "Science-Driven", description: "Every insight is backed by satellite data, field observations, and peer-reviewed methodologies." },
  { icon: Heart, title: "Impact-Focused", description: "We measure success by the hectares regenerated, the communities empowered, and the ecosystems restored." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Our Mission</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-foreground">
            About Mazingira Cloud
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
            We're building the next-generation environmental intelligence platform for Africa,
            starting with the Congo Basin — the world's second-largest tropical rainforest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none mb-16"
        >
          <div className="p-8 rounded-2xl bg-card border border-border">
            <p className="text-muted-foreground leading-relaxed">
              Mazingira Cloud combines <strong className="text-foreground">open-source satellite data</strong> with{" "}
              <strong className="text-foreground">AI-powered analytics</strong> to democratize access to environmental intelligence.
              Our platform serves farmers, NGOs, researchers, and agribusinesses with real-time insights on
              soil health, climate risks, crop performance, and regenerative agriculture strategies.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Based in <strong className="text-foreground">North Kivu, Democratic Republic of the Congo</strong>,
              we understand the ground realities of environmental challenges in Central Africa.
              Our mission is to empower communities with the data and tools they need to build
              climate-resilient livelihoods.
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <v.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
