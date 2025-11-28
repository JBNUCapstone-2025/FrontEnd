import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import colors from "../styles/colors";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

const ProductImage = styled.div`
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
  font-size: 13px;
  color: ${colors.text};
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
  color: ${colors.text};
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
  // 기쁨
  {
    id: 1,
    category: "기쁨",
    brand: "무신사 스탠다드",
    name: "비비드 컬러 후드 티셔츠",
    price: 39000,
    salePrice: 29000,
    badge: "HAPPY"
  },
  {
    id: 2,
    category: "기쁨",
    brand: "NERDY",
    name: "파스텔 조거 트레이닝 팬츠",
    price: 59000,
    salePrice: 45900,
    badge: "NEW"
  },
  {
    id: 3,
    category: "기쁨",
    brand: "LINE FRIENDS",
    name: "스마일 그래픽 양말 3팩",
    price: 19000,
    salePrice: 15000,
    badge: "단독"
  },

  // 슬픔
  {
    id: 4,
    category: "슬픔",
    brand: "THERMOS",
    name: "따뜻한 차를 위한 텀블러",
    price: 29000,
    salePrice: 24900,
    badge: "위로템"
  },
  {
    id: 5,
    category: "슬픔",
    brand: "MUJI",
    name: "부드러운 코튼 이불 담요",
    price: 59000,
    salePrice: 52000,
    badge: "SOFT"
  },
  {
    id: 6,
    category: "슬픔",
    brand: "BOOKSHOP",
    name: "마음이 힘들 때 읽는 에세이",
    price: 15000,
    salePrice: 13500,
    badge: "BEST"
  },

  // 분노
  {
    id: 7,
    category: "분노",
    brand: "HOME GYM",
    name: "스트레스 펀칭 미니 샌드백",
    price: 39000,
    salePrice: 32000,
    badge: "스트레스 해소"
  },
  {
    id: 8,
    category: "분노",
    brand: "DESK TOY",
    name: "고무 스트레스 볼 3종 세트",
    price: 19000,
    salePrice: 15900,
    badge: "인기"
  },
  {
    id: 9,
    category: "분노",
    brand: "AROMA LAB",
    name: "머스크 우디 디퓨저",
    price: 27000,
    salePrice: 23900,
    badge: "CALM"
  },

  // 불안
  {
    id: 10,
    category: "불안",
    brand: "WEIGHTBLANKET",
    name: "무거운 안심 담요 7kg",
    price: 99000,
    salePrice: 89000,
    badge: "안정감"
  },
  {
    id: 11,
    category: "불안",
    brand: "AROMA LAB",
    name: "라벤더 수면 스프레이",
    price: 23000,
    salePrice: 21000,
    badge: "SLEEP"
  },
  {
    id: 12,
    category: "불안",
    brand: "MUJI",
    name: "저소음 무드 조명 스탠드",
    price: 49000,
    salePrice: 45000,
    badge: "감성"
  },

  // 설렘
  {
    id: 13,
    category: "설렘",
    brand: "COS",
    name: "심플 블랙 원피스",
    price: 89000,
    salePrice: 79000,
    badge: "DATE"
  },
  {
    id: 14,
    category: "설렘",
    brand: "JO MALONE",
    name: "플로럴 퍼퓸 30ml",
    price: 99000,
    salePrice: 92000,
    badge: "향기"
  },
  {
    id: 15,
    category: "설렘",
    brand: "ACCESSORY LAB",
    name: "미니 하트 실버 목걸이",
    price: 39000,
    salePrice: 35000,
    badge: "인기"
  },

  // 보통
  {
    id: 16,
    category: "보통",
    brand: "UNIQLO",
    name: "울트라 스트레치 조거 팬츠",
    price: 39000,
    salePrice: 32000,
    badge: "홈웨어"
  },
  {
    id: 17,
    category: "보통",
    brand: "STARBUCKS",
    name: "하루 한 잔 원두 세트",
    price: 19000,
    salePrice: 17500,
    badge: "에너지"
  },
  {
    id: 18,
    category: "보통",
    brand: "무신사 스탠다드",
    name: "폭신 폭신 오버핏 후드 집업",
    price: 49000,
    salePrice: 43000,
    badge: "따뜻"
  }
];

// 감정 카테고리
const CATEGORIES = ["전체", "기쁨", "설렘",  "보통", "슬픔", "불안", "분노"];

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
        <Title>쇼핑</Title>
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
            const { id, brand, name, price, salePrice, badge } = product;
            const discount =
              salePrice && price
                ? Math.round((1 - salePrice / price) * 100)
                : null;

            return (
              <ProductCard key={id} onClick={() => handleCardClick(product)}>
                <ProductImageWrapper>
                  <ProductImage>LOOKBOOK</ProductImage>
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
