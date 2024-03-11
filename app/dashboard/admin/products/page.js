// List All Products of certain page, only available for admin
"use client";

import ProductList from '@/components/admin/ProductList';

export default function AdminProducstList() {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <p className="lead">List of Products</p>
                    <hr />
                    <ProductList />
                </div>
            </div>
        </div>
    );
}