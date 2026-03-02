import React from 'react';

function ServiceCardSkeleton() {
    return (
        <div className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(33.333%-16px)] flex flex-col">
            {/* Image Skeleton */}
            <div className="relative aspect-[16/10] rounded-t-xl overflow-hidden">
                <div className="w-full h-full bg-white/10 skeleton-shimmer" />
            </div>

            {/* Content Skeleton */}
            <div
                className="p-4 rounded-b-xl flex flex-col gap-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
                {/* Category */}
                <div className="h-3 w-20 rounded-full bg-white/10 skeleton-shimmer" />
                {/* Title */}
                <div className="h-5 w-3/4 rounded-md bg-white/10 skeleton-shimmer" />
                {/* Description lines */}
                <div className="flex flex-col gap-2">
                    <div className="h-3.5 w-full rounded-md bg-white/10 skeleton-shimmer" />
                    <div className="h-3.5 w-5/6 rounded-md bg-white/10 skeleton-shimmer" />
                </div>
                {/* CTA */}
                <div className="h-4 w-24 rounded-md bg-white/10 skeleton-shimmer mt-1" />
            </div>
        </div>
    );
}

export default ServiceCardSkeleton;
