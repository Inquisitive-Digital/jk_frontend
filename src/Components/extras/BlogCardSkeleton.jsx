import React from 'react';

function BlogCardSkeleton() {
    return (
        <div className="flex flex-col">
            {/* Image Skeleton */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-white/10 skeleton-shimmer" />
            </div>

            {/* Content Skeleton */}
            <div
                className="p-5 md:p-6 flex flex-col gap-3 mt-[-1px] rounded-b-2xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
                {/* Meta info */}
                <div className="flex items-center gap-4">
                    <div className="h-3 w-20 rounded-md bg-white/10 skeleton-shimmer" />
                    <div className="h-3 w-16 rounded-md bg-white/10 skeleton-shimmer" />
                </div>
                {/* Title */}
                <div className="h-5 w-3/4 rounded-md bg-white/10 skeleton-shimmer" />
                {/* Excerpt lines */}
                <div className="flex flex-col gap-2">
                    <div className="h-3.5 w-full rounded-md bg-white/10 skeleton-shimmer" />
                    <div className="h-3.5 w-5/6 rounded-md bg-white/10 skeleton-shimmer" />
                    <div className="h-3.5 w-4/6 rounded-md bg-white/10 skeleton-shimmer" />
                </div>
                {/* Read More CTA */}
                <div className="h-4 w-24 rounded-md bg-white/10 skeleton-shimmer mt-auto" />
            </div>
        </div>
    );
}

export default BlogCardSkeleton;
