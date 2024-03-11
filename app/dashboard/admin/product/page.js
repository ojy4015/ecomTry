import ProductCreate from "@/components/product/ProductCreat";

export default function AddProduct() {
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col">                    
                    <ProductCreate />
                </div>
            </div>
        </div>
    );
}