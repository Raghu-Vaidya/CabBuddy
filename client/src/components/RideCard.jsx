import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { motion } from "framer-motion";

const RideCard = ({ details }) => {
  const { creator, origin, destination, startTime, endTime, price } = details;
  function getTime(dateTimeInput) {
    const selectedDate = new Date(dateTimeInput);
    // Extract the time without seconds
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    // Format the time as HH:mm
    return `${hours}:${minutes}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="container border border-border/50 rounded-xl my-4 p-6 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer"
    >
      <div className="relative border-l-2 border-primary/20 sm:mx-2 pl-6 py-2">
        <div className="mb-8 relative">
          <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-primary shadow-sm"></div>
          <div className="flex items-center gap-3">
            <time className="text-xl font-bold text-primary tabular-nums">{getTime(startTime)}</time>
            <h3 className="text-lg font-medium text-foreground">{origin.place}</h3>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-accent shadow-sm"></div>
          <div className="flex items-center gap-3">
            <time className="text-xl font-bold text-muted-foreground tabular-nums">{getTime(endTime)}</time>
            <h3 className="text-lg font-medium text-foreground">{destination.place}</h3>
          </div>
        </div>
        <div className="absolute top-0 right-0 text-right">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">₹{price}</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">per seat</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
        <div className="inline-flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={creator.profilePicture || "https://github.com/shadcn.png"} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{creator.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{creator.name}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Ride Captain</span>
          </div>
        </div>
        <div className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
          Instant Booking
        </div>
      </div>
    </motion.div>
  )
}

export default RideCard