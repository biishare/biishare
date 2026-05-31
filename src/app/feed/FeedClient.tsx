'use client'

import Hero from "@/components/Header/HeroSection";
import ContentFilters from "@/components/Category/ContentFilters";
import ContentList from "@/components/Course/Course";

export default function FeedClient() {
  return (
    <>
      <Hero />

      <div className="pb-10 space-y-8">
        <div className="pt-2 lg:px-24">
          <ContentFilters />
          <ContentList />
        </div>
      </div>
    </>
  );
}