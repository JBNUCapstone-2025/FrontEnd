import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import colors from "../styles/colors";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// 이미지 import
import enterkey from "../img/shop/enterkey.png";
import eye from "../img/shop/eye.png";
import oil from "../img/shop/oil.png";
import stressball from "../img/shop/stressball.png";
import candle from "../img/shop/candle.png";
import coloringbook from "../img/shop/coloringbook.png";
import cotton from "../img/shop/cotton.png";
import slime from "../img/shop/slime.png";
import sandback from "../img/shop/sandback.png";



const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;              /* 고정 높이 */
  max-width: 470px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  padding-inline: 15px;
  background-color: #ffffff;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 15px;
  margin-top: 20px;
  justify-content: space-between;
  border-bottom: 1px solid ${colors.deactivate};
`;

const BackButton = styled(FaAngleLeft)`
  font-size: 20px;
  cursor: pointer;
  color: ${colors.text};
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

const Placeholder = styled.div`
  width: 20px;
`;

// 상단 카테고리 + 아래 상품영역을 감싸는 컨테이너
const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 0 80px;
  overflow: hidden;        /* 안쪽만 스크롤 */
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 5px 15px;
  border-bottom: 1px solid ${colors.deactivate};
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 0;
  }
`;

const CategoryTab = styled.button`
  flex-shrink: 0;
  padding: 8px 14px;
  border-radius: 999px;

  /* active 아닐 때만 테두리 보이게 */
  border: 1px solid
    ${(props) => (props.active ? "transparent" : colors.deactivate)};

  background-color: ${(props) =>
    props.active ? colors.text : "transparent"};
  color: ${(props) => (props.active ? "#ffffff" : colors.text)};
  font-size: 13px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;
  white-space: nowrap;

  /* 클릭/포커스 시 생기는 파란 테두리/하이라이트 제거 */
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
    border-color: ${(props) =>
      props.active ? "transparent" : colors.deactivate};
  }
`;

// 상품 리스트 그리드 (이 부분만 세로 스크롤)
const ProductGrid = styled.div`
  flex: 1;                /* 남은 공간을 전부 차지 */
  overflow-y: auto;       /* 여기서만 스크롤 */
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 18px 5px 0;
`;

const ProductCard = styled.div`
  cursor: pointer;
`;

const ProductImageWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
  padding-top: 130%; /* 3:4 비율 이미지 박스 */
`;

const ProductImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: ${colors.deactivate};
`;

const Badge = styled.span`
  position: absolute;
  left: 8px;
  top: 8px;
  font-size: 10px;
  padding: 3px 6px;
  border-radius: 999px;
  background-color: #111111;
  color: #ffffff;
`;

const ProductBrand = styled.div`
  margin-top: 7px;
  font-size: 11px;
  color: ${colors.deactivate};
`;

const ProductName = styled.div`
  margin-top: 3px;
  font-size: 15px;
  color: ${colors.airplanebody};
  line-height: 1.3;
`;

const PriceRow = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: baseline;
  gap: 5px;
`;

const SalePrice = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.airplanebody};
`;

const OriginalPrice = styled.span`
  font-size: 12px;
  color: ${colors.deactivate};
  text-decoration: line-through;
`;

const DiscountRate = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #ff4d4f;
`;

// 감정 기반 더미 상품 데이터
const PRODUCTS = [
  // 슬픔
  {
    id: 4,
    category: "슬픔",
    brand: "써니데이마켓",
    name: "옥상정원 꽃 컬러링북",
    price: 13500,
    image: coloringbook
  },
  {
    id: 5,
    category: "슬픔",
    brand: "MUJI",
    name: "부드러운 코튼 이불 담요",
    price: 24000,
    image: cotton
  },

  // 분노
  {
    id: 7,
    category: "분노",
    brand: "알럽하우스",
    name: "분노의 엔터키 쿠션",
    price: 13900,
    image: enterkey
  },
  {
    id: 8,
    category: "분노",
    brand: "현미온미",
    name: "현미온미 눈 찜질팩",
    price: 19800,
    image: eye
  },
  {
    id: 9,
    category: "분노",
    brand: "스타배송",
    name: "팔레트슬라임 5종 랜덤박스/안전한 수제 액체괴물",
    price: 31500,
    image: slime
  },
  {
    id: 13,
    category: "분노",
    brand: "에베라스트",
    name: "인플레이터블 밥 백(120cm)/공기주입 샌드백",
    price: 19800,
    image: sandback
  },

  // 불안
  {
    id: 10,
    category: "불안",
    brand: "아로니카",
    name: "모던 소이캔들 캔들워머 세트",
    price: 19600,
    image: oil
  },
  {
    id: 11,
    category: "불안",
    brand: "아이데이지",
    name: "고무 스트레스볼",
    price: 5900,
    image: stressball
  },
  {
    id: 12,
    category: "불안",
    brand: "리베르",
    name: "비건 에센셜 아로마 오일롤온 & 괄사 세트",
    price: 38000,
    image: candle
  }
];

// 감정 카테고리
const CATEGORIES = ["전체", "슬픔", "불안", "분노"];

const formatPrice = (price) => {
  if (!price && price !== 0) return "";
  return price.toLocaleString("ko-KR") + "원";
};

const Shop = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredProducts =
    selectedCategory === "전체"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleCardClick = (product) => {
    console.log("clicked product: ", product);
    // 나중에 상세 페이지 만들면 여기서 navigate(`/shop/${product.id}`);
  };

  return (
    <Wrapper>
      <TopBar>
        <BackButton onClick={() => navigate("/main")} />
        <Title>상점</Title>
        <Placeholder />
      </TopBar>

      <Content>
        <CategoryTabs>
          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </CategoryTab>
          ))}
        </CategoryTabs>

        <ProductGrid>
          {filteredProducts.map((product) => {
            const { id, brand, name, price, salePrice, badge, image } = product;
            const discount =
              salePrice && price
                ? Math.round((1 - salePrice / price) * 100)
                : null;

            return (
              <ProductCard key={id} onClick={() => handleCardClick(product)}>
                <ProductImageWrapper>
                  {image ? (
                    <ProductImage src={image} alt={name} />
                  ) : (
                    <PlaceholderText>LOOKBOOK</PlaceholderText>
                  )}
                  {badge && <Badge>{badge}</Badge>}
                </ProductImageWrapper>

                <ProductBrand>{brand}</ProductBrand>
                <ProductName>{name}</ProductName>

                <PriceRow>
                  <SalePrice>{formatPrice(salePrice || price)}</SalePrice>
                  {salePrice && (
                    <>
                      <OriginalPrice>{formatPrice(price)}</OriginalPrice>
                      {discount && <DiscountRate>{discount}%</DiscountRate>}
                    </>
                  )}
                </PriceRow>
              </ProductCard>
            );
          })}
        </ProductGrid>
      </Content>

      <Header />
    </Wrapper>
  );
};

export default Shop;
