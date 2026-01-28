import React from 'react';
import { motion } from 'framer-motion';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}
export function Card({
  children,
  className = '',
  onClick,
  hover = false
}: CardProps) {
  const baseStyles =
  'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden';
  const hoverStyles = hover ?
  'hover:shadow-md hover:border-amber-200 transition-all duration-300 cursor-pointer' :
  '';
  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{
          y: -2
        }}
        className={`${baseStyles} ${hoverStyles} ${className}`}
        onClick={onClick}>

        {children}
      </motion.div>);

  }
  return <div className={`${baseStyles} ${className}`}>{children}</div>;
}
export function CardHeader({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>);

}
export function CardTitle({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>);

}
export function CardContent({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
export function CardFooter({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <div
      className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`}>

      {children}
    </div>);

}