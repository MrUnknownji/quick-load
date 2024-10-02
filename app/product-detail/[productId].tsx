import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TextInput,
  LayoutAnimation,
  RefreshControl,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FEATURES } from "@/assets/data/DATA";
import IconButton from "@/components/button/IconButton";
import Sizes from "@/constants/Sizes";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import LargeImageView from "@/components/image-views/LargeImageView";
import Button from "@/components/button/Button";
import { t } from "i18next";
import RadioButtonGroup from "@/components/input-fields/RadioButtonGroup";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFetchProductById } from "@/hooks/useFetchProduct";
import { Product } from "@/types/Product";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { responsive, vw, vh } from "@/utils/responsive";

const ProductDetailPage = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [isPricingVisible, setIsPricingVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { product, loading, error, fetchProduct } =
    useFetchProductById(productId);

  const togglePricingVisibility = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsPricingVisible(!isPricingVisible);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProduct();
    setRefreshing(false);
  }, [fetchProduct, productId]);

  if (loading && !refreshing)
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </CenteredContainer>
    );

  if (error || !product)
    return (
      <CenteredContainer>
        <ThemedText style={styles.errorText}>
          {error || t("Product not found")}
        </ThemedText>
      </CenteredContainer>
    );

  return (
    <SafeAreaWrapper>
      <ThemedView style={{ flex: 1 }}>
        <ProductHeader heading={product.productType} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ minHeight: vh(100) - responsive(100) }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.productContainer}>
            <LargeImageView
              imageUrl={`https://quick-load.onrender.com${product.productImage}`}
              style={{ marginHorizontal: 0 }}
            />
            {!isPricingVisible && (
              <>
                <ThemedText style={styles.productDescription}>
                  {t(product.productDetails ?? "")}
                </ThemedText>
                <ProductFeaturesCard price={Number(product.productPrice)} />
              </>
            )}
            {isPricingVisible && <PricingCard item={product} />}
          </View>
        </ScrollView>
        <Button
          title={isPricingVisible ? t("Book Order") : t("Buy Now")}
          variant="primary"
          size="medium"
          style={styles.bottomButton}
          onPress={() => {
            if (isPricingVisible) {
              router.push({
                pathname: "/thank-you",
                params: {
                  message: t(
                    "Thank you for the purchase. You will receive your product shortly.",
                  ),
                },
              });
            }
            togglePricingVisibility();
          }}
        />
      </ThemedView>
    </SafeAreaWrapper>
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
        left: responsive(20),
        borderRadius: responsive(Sizes.borderRadiusFull),
        top: responsive(5),
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
    "text",
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
      {FEATURES.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Ionicons
            name="checkmark-circle"
            size={Sizes.icon.small}
            color={primaryTextColor}
          />
          <ThemedText style={styles.featureText}>{t(feature)}</ThemedText>
        </View>
      ))}
    </ThemedView>
  );
};

const PricingCard = ({ item }: { item: Product }) => {
  const [quantity, setQuantity] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("paymentNow");
  const itemPrice = Number(item.productPrice ?? 0);
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
    "textSecondary",
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
        <PricingCardItem label={t("Pieces(1000)")}>
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
              2,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productHeadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: responsive(Sizes.paddingMedium),
  },
  productHeading: {
    fontSize: responsive(Sizes.textExtraLarge),
    fontWeight: "bold",
    paddingTop: responsive(Sizes.paddingLarge),
  },
  productContainer: {
    marginTop: responsive(Sizes.marginMedium),
    gap: responsive(Sizes.marginMedium),
  },
  productDescription: {
    textAlign: "left",
    marginHorizontal: responsive(Sizes.marginHorizontal),
    fontSize: responsive(Sizes.textNormal),
  },
  productFeaturesCard: {
    marginBottom: responsive(100),
    padding: responsive(Sizes.paddingMedium),
    borderRadius: responsive(Sizes.borderRadiusLarge),
    elevation: 3,
    marginHorizontal: responsive(Sizes.marginHorizontal),
  },
  featureCardHeading: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    textAlign: "center",
  },
  featureCardPrice: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
  },
  perPieceText: {
    fontSize: responsive(Sizes.textSmall),
    fontWeight: "normal",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsive(Sizes.marginExtraSmall),
    paddingVertical: responsive(Sizes.paddingExtraSmall),
  },
  featureText: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "normal",
  },
  errorText: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
  },
  bottomButton: {
    position: "absolute",
    bottom: responsive(10),
    marginHorizontal: responsive(Sizes.marginHorizontal),
    width: vw(100) - responsive(Sizes.marginHorizontal * 2),
  },
});

const styles2 = StyleSheet.create({
  pricingCard: {
    marginVertical: responsive(Sizes.marginVertical),
    padding: responsive(Sizes.paddingMedium),
    borderRadius: responsive(Sizes.borderRadiusLarge),
    elevation: 3,
    gap: responsive(Sizes.marginExtraSmall),
    marginHorizontal: responsive(Sizes.marginHorizontal),
  },
  pricingCardHeading: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    textAlign: "center",
  },
  pricingCardListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: responsive(Sizes.marginSmall),
    width: "100%",
  },
  pricingCardListItemText: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
  },
  piecesInput: {
    paddingHorizontal: responsive(Sizes.paddingSmall),
    fontWeight: "bold",
    width: "auto",
    minWidth: responsive(50),
    borderColor: Colors.light.border,
    borderWidth: 0.5,
    borderRadius: responsive(Sizes.borderRadiusLarge),
  },
  perPiecePriceText: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
  },
  offerDetailText: {
    fontSize: responsive(Sizes.textSmall),
    fontWeight: "normal",
  },
  offerText: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
  },
  paymentMethodHeading: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    marginVertical: responsive(Sizes.marginMedium),
    textAlign: "center",
    marginTop: responsive(Sizes.marginLarge),
  },
});

export default ProductDetailPage;
