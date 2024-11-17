import React from 'react';
import Image from 'next/image';

const BrandFooter = () => {
    return (
        <div className="mt-8 space-y-4">
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Powered by
                </span>
            </div>
            <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center space-x-2">
                    <Image
                        src="/icons/pinata.svg"
                        alt="Pinata Cloud"
                        width={100}
                        height={32}
                        className="opacity-75 hover:opacity-100 transition-opacity"
                    />
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center space-x-2">
                    <Image
                        src="/icons/goldman.svg"
                        alt="Goldman Sachs"
                        width={120}
                        height={32}
                        className="opacity-75 hover:opacity-100 transition-opacity"
                    />
                </div>
            </div>
        </div>
    );
};

export default BrandFooter;