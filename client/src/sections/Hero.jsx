import bg from "@/assets/hero.svg"
import Search from "@/components/Search"
import { motion } from "framer-motion"

const Hero = () => {
  return (
    <div className="relative h-[85vh] flex justify-center items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left pt-20 lg:pt-0"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Your pick of rides at <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">low prices</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
            Connect with people heading your way. Share rides, save money, and reduce your carbon footprint with CabBuddy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <img src={bg} className="w-full h-auto object-contain drop-shadow-2xl" alt="hero" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute z-20 -bottom-12 w-full px-4 flex justify-center sm:-bottom-16"
      >
        <div className="w-full max-w-4xl shadow-2xl shadow-primary/10 rounded-xl overflow-hidden">
          <Search />
        </div>
      </motion.div>
    </div>
  )
}

export default Hero