import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import api from "../../api/Api";
import Card from "../../component/Card/Card";
import "./Products.css";
import { toast } from "react-toastify";
import { RotateCw } from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(
    async (showLoading = true, showToast = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);
        const response = await api.get("/products");
        if (response.data && response.data.data) {
          const newProducts = response.data.data;
          setProducts((prevProducts) => {
            const previousCount = prevProducts.length;

            // إظهار رسالة فقط عند الضغط على زر التحديث أو عند إضافة منتجات جديدة
            if (showToast && !showLoading) {
              if (newProducts.length > previousCount) {
                toast.success(
                  `${
                    newProducts.length - previousCount
                  } new products have been added`
                );
              } else {
                toast.success("Products updated successfully");
              }
            }

            return newProducts;
          });
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        if (showLoading) {
          toast.error("Failed to load products");
        } else if (showToast) {
          toast.error("Failed to update products");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProducts();

    // تحديث تلقائي كل 30 ثانية (بدون إظهار رسائل)
    const interval = setInterval(() => {
      fetchProducts(false, false);
    }, 30000);

    // تحديث عند العودة للصفحة (بدون إظهار رسائل)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchProducts(false, false);
      }
    };

    // تحديث عند التركيز على النافذة (بدون إظهار رسائل)
    const handleFocus = () => {
      fetchProducts(false, false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchProducts]);

  const handleAddToCart = (product) => {
    // يمكنك إضافة منطق إضافة المنتج للسلة هنا
    toast.success(`${product.title} has been added to the cart`);
  };

  if (loading) {
    return (
      <Container className="products-container">
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="products-container">
        <div className="text-center py-5">
          <p className="text-danger">{error}</p>
          <button className="btn btn-danger mt-3" onClick={fetchProducts}>
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="products-container py-5">
      <div className="products-header mb-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <div>
            <h1 className="mb-2">All Products</h1>
            <p className="text-muted mb-0">
              Total products: <strong>{products.length}</strong>
            </p>
          </div>
          <Button
            variant="danger"
            onClick={() => fetchProducts(false, true)}
            disabled={refreshing || loading}
            className="refresh-btn"
          >
            <RotateCw className={refreshing ? "spinning" : ""} size={18} />
            <span className="ms-2">Update</span>
          </Button>
        </div>
       <p className="mt-3">Loading products...</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5">
        <p className="text-muted">No products available at the moment</p>
        </div>
      ) : (
        <Row className="g-4">
          {products.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                imgSrc={product.image || "./image/g92-2-500x500 1.png"}
                prodName={product.title}
                finalPrice={product.price}
                originalPrice={null}
                salePercentage={null}
                eye={true}
                heart={true}
                del={false}
                onAddToCart={() => handleAddToCart(product)}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Products;
