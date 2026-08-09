'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export default function useAdminReviewsUnread(currentUser) {
    const pathname = usePathname();
    const [hasUnreadReviews, setHasUnreadReviews] = useState(false);

    const isReviewsPage = pathname === '/admin/reviews';

    useEffect(() => {
        if (!currentUser?.is_staff) return;

        let isCancelled = false;

        const checkReviews = async () => {
            try {
                const data = await api.getAdminReviews();
                if (isCancelled) return;
                const reviews = Array.isArray(data) ? data : data.results || [];
                const seenCount = parseInt(localStorage.getItem('admin_seen_review_count') || '0', 10);

                if (reviews.length > seenCount && !isReviewsPage) {
                    setHasUnreadReviews(true);
                }

                if (isReviewsPage) {
                    localStorage.setItem('admin_seen_review_count', String(reviews.length));
                    setHasUnreadReviews(false);
                }
            } catch (_) {}
        };

        checkReviews();
        // Poll every 30 seconds for new reviews
        const interval = setInterval(checkReviews, 30000);

        return () => {
            isCancelled = true;
            clearInterval(interval);
        };
    }, [currentUser, isReviewsPage]);

    useEffect(() => {
        if (isReviewsPage) {
            setHasUnreadReviews(false);
        }
    }, [isReviewsPage]);

    return hasUnreadReviews;
}
