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
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

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
        <ThemedText style={styles.errorText}>
          {t("Product not found")}
        </ThemedText>
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
                  <ThemedText style={styles.productDescription}>
                    {t(product.productDescription ?? "")}
                  </ThemedText>
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
          if (isPricingVisible) {
            router.push({
              pathname: "/thank-you",
              params: {
                message: t(
                  "Thank you for the purchase. You will receive your product shortly."
                ),
              },
            });
          }
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
    <ThemedText style={styles.productHeading}>{t(heading)}</ThemedText>
  </View>
);

const CenteredContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    {children}
  </View>
);

const ProductFeaturesCard = ({ price }: { price?: number }) => {
  const primaryTextColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "text"
  );
  return (
    <ThemedView style={styles.productFeaturesCard}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <ThemedText style={styles.featureCardHeading}>
          {t("Our Features")}
        </ThemedText>
        <ThemedText
          style={[styles.featureCardPrice, { color: primaryTextColor }]}
        >
          {price}
          <ThemedText style={styles.perPieceText}>/{t("Piece")}</ThemedText>
        </ThemedText>
      </View>
      <FlatList
        data={FEATURES}
        renderItem={(item) => renderFeatureItem(item, primaryTextColor)}
      />
    </ThemedView>
  );
};

const renderFeatureItem = (
  {
    item,
  }: {
    item: string;
  },
  primaryTextColor: string
) => (
  <View style={styles.featureItem}>
    <Ionicons
      name="checkmark-circle"
      size={Sizes.icon.small}
      color={primaryTextColor}
    />
    <ThemedText style={styles.featureText}>{t(item)}</ThemedText>
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

  const placeholderColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary"
  );

  const handleQuantityChange = (input: string) => {
    const sanitizedInput = input.replace(/[^0-9]/g, "");
    setQuantity(Number(sanitizedInput));
  };

  return (
    <ScrollView style={{ marginBottom: 200 }}>
      <ThemedView style={styles2.pricingCard}>
        <ThemedText style={styles2.pricingCardHeading}>
          {t("Pricing")}
        </ThemedText>
        <PricingCardItem label={t("Piece")}>
          <TextInput
            style={styles2.piecesInput}
            placeholder={t("Qty")}
            value={quantity > 0 ? quantity.toString() : ""}
            keyboardType="number-pad"
            onChange={(e) => handleQuantityChange(e.nativeEvent.text)}
            placeholderTextColor={placeholderColor}
          />
        </PricingCardItem>
        <PricingCardItem label={t("Price/piece")}>
          <ThemedText style={styles2.perPiecePriceText}>
            {t("Rs.")} {itemPrice.toFixed(2)}
          </ThemedText>
        </PricingCardItem>
        <PricingCardItem label={t("Offer")} offer>
          <ThemedText style={styles2.offerText}>
            {t("Rs.")} {discount.toFixed(2)}
          </ThemedText>
        </PricingCardItem>
        <PricingCardItem label={t("Loading Charges")}>
          <ThemedText style={styles2.offerText}>
            {t("Rs.")} {quantity < 1 ? "0.00" : loadingCharges}
          </ThemedText>
        </PricingCardItem>
        <PricingCardItem label={t("Broker Charges")}>
          <ThemedText style={styles2.offerText}>
            {t("Rs.")} {quantity < 1 ? "0.00" : brokerCharges}
          </ThemedText>
        </PricingCardItem>
        <PricingCardItem label={t("Plateform Fees")}>
          <ThemedText style={styles2.offerText}>
            {t("Rs.")} {quantity < 1 ? "0.00" : platformFees}
          </ThemedText>
        </PricingCardItem>
        <PricingCardItem label={t("Total")}>
          <ThemedText style={styles2.totalPrice}>
            {t("Rs.")}{" "}
            {(parseFloat(totalPrice) - parseFloat(discount.toString())).toFixed(
              2
            )}
          </ThemedText>
        </PricingCardItem>
      </ThemedView>
      <View>
        <ThemedText style={styles2.paymentMethodHeading}>
          {t("Select Your Payment method")}
        </ThemedText>
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
    <ThemedText style={styles2.pricingCardListItemText}>
      {t(label)}
      {offer && (
        <ThemedText style={styles2.offerDetailText}>
          {t("(10% off on first Order)")}
        </ThemedText>
      )}
    </ThemedText>
    {children}
  </View>
);

const styles2 = StyleSheet.create({
  pricingCard: {
    marginVertical: Sizes.marginVertical,
    padding: Sizes.paddingMedium,
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
    marginTop: Sizes.marginLarge,
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
    paddingTop: Sizes.paddingSmall,
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
  },
  perPieceText: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
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
