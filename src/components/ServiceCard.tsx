"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string | ReactNode;
  color: string;
  textColor: string;
  link: string;
  borderColor?: string;
  shadowColor?: string;
  index?: number;
}

export default function ServiceCard({ 
  title, 
  description, 
  icon, 
  color, 
  textColor,
  link,
  borderColor,
  shadowColor,
  index = 0 
}: ServiceCardProps) {
  // Variants for the card container
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  // Variants for the icon
  const iconVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    }
  };

  // Variants for text elements
  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 10
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4
      }
    }
  };

  // Apply border color if provided, otherwise use color prop
  const borderColorClass = borderColor || color;

  return (
    <motion.div 
      className={`bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300 border-t-4 ${borderColorClass}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }}
      whileHover={{ 
        y: -5, 
        scale: 1.02, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <motion.div 
        className={`w-20 h-20 ${color} rounded-full flex items-center justify-center mb-6`}
        variants={iconVariants}
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2, type: "spring" } 
        }}
      >
        {icon}
      </motion.div>
      
      <motion.h3 
        className={`mb-3 text-2xl font-semibold ${textColor}`}
        variants={textVariants}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-secondary/70 mb-4"
        variants={textVariants}
      >
        {description}
      </motion.p>
      
      <motion.div
        variants={textVariants}
      >
        <Link 
          href={link} 
          className={`${textColor} font-medium hover:opacity-80 flex items-center group`}
        >
          <motion.span
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Learn more
          </motion.span>
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </motion.svg>
        </Link>
      </motion.div>
    </motion.div>
  );
} 