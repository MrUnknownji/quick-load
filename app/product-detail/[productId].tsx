import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  LayoutAnimation,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  BRICKS_ITEMS,
  BAJRI_ITEMS,
  GRIT_ITEMS,
  CEMENT_ITEMS,
  SAND_ITEMS,
  FEATURES,
} from "@/assets/data/DATA";
import IconButton from "@/components/button/IconButton";
import Sizes from "@/constants/Sizes";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import LargeImageView from "@/components/image-views/LargeImageView";
import Button from "@/components/button/Button";
import { ListItemProps } from "@/constants/types/types";
import { t } from "i18next";
import RadioButtonGroup from "@/components/input-fields/RadioButtonGroup";
import { ScrollView } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("screen");

const ProductDetailPage = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = useState<ListItemProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPricingVisible, setIsPricingVisible] = useState(false);

  useEffect(() => {
    const fetchProduct = () => {
      const productListMap = {
        bricks: BRICKS_ITEMS,
        bajri: BAJRI_ITEMS,
        grit: GRIT_ITEMS,
        cement: CEMENT_ITEMS,
        sand: SAND_ITEMS,
      };

      type ProductCategory = keyof typeof productListMap;

      const productCategory = Object.keys(productListMap).find((key) =>
        productId.includes(key)
      ) as ProductCategory | undefined;

      if (productCategory) {
        const foundProduct = productListMap[productCategory].find(
          (p: ListItemProps) => p.productId === productId
        );
        setProduct(foundProduct ?? null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const togglePricingVisibility = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsPricingVisible(!isPricingVisible);
  };

  if (loading)
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" />
      </CenteredContainer>
    );

  if (!product)
    return (
      <CenteredContainer>
        <Text style={styles.errorText}>{t("Product not found")}</Text>
      </CenteredContainer>
    );

  return (
    <View style={{ flex: 1 }}>
      <ProductHeader heading={product.heading} />
      <FlatList
        style={{ flex: 1 }}
        data={[
          () => (
            <View style={styles.productContainer}>
              <LargeImageView
                imageUrl={product.imageUrl}
                style={{ marginHorizontal: 0 }}
              />
              {!isPricingVisible && (
                <>
                  <Text style={styles.productDescription}>
                    {t(product.productDescription ?? "")}
                  </Text>
                  <ProductFeaturesCard price={Number(product.price)} />
                </>
              )}
            </View>
          ),
        ]}
        renderItem={({ item }) => item()}
        ListFooterComponent={
          isPricingVisible ? <PricingCard item={product} /> : null
        }
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        title={isPricingVisible ? t("Book Order") : t("Buy Now")}
        variant="primary"
        size="medium"
        style={{
          position: "absolute",
          bottom: 10,
          marginHorizontal: Sizes.marginHorizontal,
          width: screenWidth - Sizes.marginHorizontal * 2,
        }}
        onPress={() => {
          if (isPricingVisible)
            router.push({
              pathname: "/thank-you",
              params: {
                message: t(
                  "Thank you for the purchase. You will receive your product shortly."
                ),
              },
            });
          togglePricingVisibility();
        }}
      />
    </View>
  );
};

const ProductHeader = ({ heading }: { heading: string }) => (
  <View style={styles.productHeadingContainer}>
    <IconButton
      iconName="chevron-back"
      size="small"
      variant="primary"
      style={{
        position: "absolute",
        left: 20,
        borderRadius: Sizes.borderRadiusFull,
        top: 5,
      }}
      onPress={() => router.back()}
    />
    <Text style={styles.productHeading}>{t(heading)}</Text>
  </View>
);

const CenteredContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    {children}
  </View>
);

const ProductFeaturesCard = ({ price }: { price?: number }) => (
  <View style={styles.productFeaturesCard}>
    <View
      style={{ alignItems: "center", justifyContent: "center", width: "100%" }}
    >
      <Text style={styles.featureCardHeading}>{t("Our Features")}</Text>
      <Text style={styles.featureCardPrice}>
        {price}
        <Text style={styles.perPieceText}>/{t("Piece")}</Text>
      </Text>
    </View>
    <FlatList data={FEATURES} renderItem={renderFeatureItem} />
  </View>
);

const renderFeatureItem = ({ item }: { item: string }) => (
  <View style={styles.featureItem}>
    <Ionicons
      name="checkmark-circle"
      size={Sizes.icon.small}
      color={Colors.light.primary}
    />
    <Text style={styles.featureText}>{t(item)}</Text>
  </View>
);

const PricingCard = ({ item }: { item: ListItemProps }) => {
  const [quantity, setQuantity] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("paymentNow");
  const itemPrice = Number(item.price ?? 0);
  const loadingCharges = (quantity * itemPrice * 0.05).toFixed(2);
  const brokerCharges = (quantity * itemPrice * 0.1).toFixed(2);
  const platformFees = (quantity * itemPrice * 0.2).toFixed(2);
  const extraCharges = (
    parseFloat(loadingCharges) +
    parseFloat(brokerCharges) +
    parseFloat(platformFees)
  ).toFixed(2);
  const totalPriceRaw =
    Number(quantity * itemPrice) + Number(quantity < 1 ? 0 : extraCharges);
  const discount = totalPriceRaw * 0.1;
  const totalPrice = (totalPriceRaw - discount).toFixed(2);

  const handleQuantityChange = (input: string) => {
    const sanitizedInput = input.replace(/[^0-9]/g, "");
    setQuantity(Number(sanitizedInput));
  };

  return (
    <ScrollView style={{ marginBottom: 200 }}>
      <View style={styles2.pricingCard}>
        <Text style={styles2.pricingCardHeading}>{t("Pricing")}</Text>
        <PricingCardItem label={t("Piece")}>
          <TextInput
            style={styles2.piecesInput}
            placeholder={t("Qty")}
            value={quantity > 0 ? quantity.toString() : ""}
            keyboardType="number-pad"
            onChange={(e) => handleQuantityChange(e.nativeEvent.text)}
          />
        </PricingCardItem>
        <PricingCardItem label={t("Price/piece")}>
          <Text style={styles2.perPiecePriceText}>
            {t("Rs.")} {itemPrice.toFixed(2)}
          </Text>
        </PricingCardItem>
        <PricingCardItem label={t("Offer")} offer>
          <Text style={styles2.offerText}>
            {t("Rs.")} {discount.toFixed(2)}
          </Text>
        </PricingCardItem>
        <PricingCardItem label={t("Loading Charges")}>
          <Text style={styles2.offerText}>
            {t("Rs.")} {quantity < 1 ? "0.00" : loadingCharges}
          </Text>
        </PricingCardItem>
        <PricingCardItem label={t("Broker Charges")}>
          <Text style={styles2.offerText}>
            {t("Rs.")} {quantity < 1 ? "0.00" : brokerCharges}
          </Text>
        </PricingCardItem>
        <PricingCardItem label={t("Plateform Fees")}>
          <Text style={styles2.offerText}>
            {t("Rs.")} {quantity < 1 ? "0.00" : platformFees}
          </Text>
        </PricingCardItem>
        <PricingCardItem label={t("Total")}>
          <Text style={styles2.totalPrice}>
            {t("Rs.")}{" "}
            {(parseFloat(totalPrice) - parseFloat(discount.toString())).toFixed(
              2
            )}
          </Text>
        </PricingCardItem>
      </View>
      <View>
        <Text style={styles2.paymentMethodHeading}>
          {t("Select Your Payment method")}
        </Text>
        <RadioButtonGroup
          options={[
            { label: t("Payment now"), value: "paymentNow" },
            { label: t("Cash on Delivery"), value: "cashOnDelivery" },
            { label: t("Pay on Delivery"), value: "payOnDelivery" },
          ]}
          onSelect={(value) => setPaymentMethod(value)}
          initialSelection={paymentMethod}
        />
      </View>
    </ScrollView>
  );
};

const PricingCardItem = ({
  label,
  children,
  offer,
}: {
  label: string;
  children: React.ReactNode;
  offer?: boolean;
}) => (
  <View style={styles2.pricingCardListItem}>
    <Text style={styles2.pricingCardListItemText}>
      {t(label)}
      {offer && (
        <Text style={styles2.offerDetailText}>
          {t("(10% off on first Order)")}
        </Text>
      )}
    </Text>
    {children}
  </View>
);

const styles2 = StyleSheet.create({
  pricingCard: {
    marginVertical: Sizes.marginVertical,
    padding: Sizes.paddingMedium,
    backgroundColor: "white",
    borderRadius: Sizes.borderRadiusLarge,
    elevation: 3,
    gap: Sizes.marginExtraSmall,
    marginHorizontal: Sizes.marginHorizontal,
  },
  pricingCardHeading: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    textAlign: "center",
  },
  pricingCardListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Sizes.marginSmall,
    width: "100%",
  },
  pricingCardListItemText: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
  piecesInput: {
    paddingHorizontal: Sizes.paddingSmall,
    fontWeight: "bold",
    width: "auto",
    minWidth: 50,
    borderColor: Colors.light.border,
    borderWidth: 0.5,
    borderRadius: Sizes.borderRadiusLarge,
  },
  perPiecePriceText: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
  offerDetailText: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
  },
  offerText: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
  paymentMethodHeading: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    marginVertical: Sizes.marginMedium,
    textAlign: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productHeadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.StatusBarHeight,
    paddingTop: Sizes.paddingSmall,
    paddingBottom: Sizes.paddingMedium,
  },
  productHeading: {
    fontSize: Sizes.textExtraLarge,
    fontWeight: "bold",
  },
  productContainer: {
    marginTop: Sizes.marginMedium,
    marginHorizontal: Sizes.marginHorizontal,
    gap: Sizes.marginMedium,
  },
  productDescription: {
    textAlign: "justify",
    marginHorizontal: Sizes.marginExtraSmall,
  },
  productFeaturesCard: {
    marginBottom: Sizes.marginVertical,
    padding: Sizes.paddingMedium,
    backgroundColor: "white",
    borderRadius: Sizes.borderRadiusLarge,
    elevation: 3,
  },
  featureCardHeading: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    textAlign: "center",
  },
  featureCardPrice: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  perPieceText: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
    color: Colors.light.text,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginExtraSmall,
    paddingVertical: Sizes.paddingExtraSmall,
  },
  featureText: {
    fontSize: Sizes.textMedium,
    fontWeight: "normal",
  },
  errorText: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
});

export default ProductDetailPage;
