import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import IconButton from "@/components/button/IconButton";
import { router } from "expo-router";
import { t } from "i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { Product } from "@/types/Product";
import {
  useDeleteProduct,
  useFetchProductsByUserId,
} from "@/hooks/useFetchProduct";
import Alert from "@/components/popups/Alert";
import FlexibleSkeleton from "@/components/Loading/FlexibleSkeleton";
import { Ionicons } from "@expo/vector-icons";
import EditDeleteDialog from "@/components/popups/EditDeleteDialog";
import { responsive } from "@/utils/responsive";

const ProductItem: React.FC<{
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}> = ({ product, onEdit, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const listItemBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "background",
  );
  const textColor = useThemeColor(
    {
      light: Colors.light.text,
      dark: Colors.dark.text,
    },
    "text",
  );

  return (
    <View
      style={[styles.listItem, { backgroundColor: listItemBackgroundColor }]}
    >
      <Image
        source={{ uri: product.productImage }}
        style={styles.listItemImage}
      />
      <View style={styles.listItemDetails}>
        <ThemedText style={styles.listItemName}>
          {product.productType}
        </ThemedText>
        <ThemedText style={styles.listItemPrice}>
          ${product.productPrice}
        </ThemedText>
        <ThemedText style={styles.listItemCategory}>
          {product.productLocation}
        </ThemedText>
      </View>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.menuButton}
      >
        <Ionicons name="ellipsis-vertical" size={24} color={textColor} />
      </TouchableOpacity>
      <EditDeleteDialog
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEdit={() => {
          setMenuVisible(false);
          onEdit(product);
        }}
        onDelete={() => {
          setMenuVisible(false);
          onDelete(product);
        }}
      />
    </View>
  );
};

const MyProducts: React.FC = () => {
  const { products, loading, error, fetchProducts } =
    useFetchProductsByUserId();

  const {
    deleteProduct,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteProduct();

  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const listItemBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "background",
  );

  const handleEditProduct = (product: Product) => {
    router.push({
      pathname: "/profile/my-products/add-product",
      params: { productId: product._id, isEdit: "true" },
    });
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setAlertVisible(true);
  };

  const confirmDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct._id as string);
        fetchProducts();
        setAlertVisible(false);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const renderSkeletonItem = () => (
    <View
      style={[styles.listItem, { backgroundColor: listItemBackgroundColor }]}
    >
      <FlexibleSkeleton
        width={85}
        height={85}
        borderRadius={Sizes.borderRadiusFull}
      />
      <View style={styles.listItemDetails}>
        <FlexibleSkeleton width={100} height={20} style={{ marginBottom: 5 }} />
        <FlexibleSkeleton width={150} height={20} style={{ marginBottom: 5 }} />
        <FlexibleSkeleton width={120} height={20} />
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <ListContainer>
          <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={renderSkeletonItem}
            keyExtractor={(item) => item.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </ListContainer>
      );
    }

    if (error) {
      return <ThemedText>Error: {error}</ThemedText>;
    }

    if (products.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Ionicons
            name="cube-outline"
            size={64}
            color={Colors.light.textSecondary}
          />
          <ThemedText style={styles.emptyStateText}>
            {t("You haven't added any products yet")}
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            {t("Tap the + button to add your first product")}
          </ThemedText>
        </View>
      );
    }

    return (
      <ListContainer>
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </ListContainer>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <IconButton
        iconName="add"
        size="medium"
        variant="primary"
        style={styles.addButton}
        onPress={() =>
          router.push({
            pathname: "/profile/my-products/add-product",
            params: { isEdit: "false" },
          })
        }
      />
      <Alert
        message={`${t("Are you sure you want to delete")} ${selectedProduct?.productType}?`}
        type="warning"
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onConfirm={confirmDeleteProduct}
      />
    </View>
  );
};

const ListContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <View style={styles.listWrapper}>{children}</View>;

export default MyProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    gap: responsive(Sizes.paddingMedium),
    paddingVertical: responsive(Sizes.paddingVertical),
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsive(Sizes.paddingSmall),
    paddingHorizontal: responsive(Sizes.paddingMedium),
    borderRadius: responsive(Sizes.borderRadiusMedium),
    marginHorizontal: responsive(Sizes.marginSmall),
    marginBottom: responsive(Sizes.marginSmall),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsive(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsive(4),
  },
  listItemImage: {
    width: responsive(85),
    height: responsive(85),
    borderRadius: responsive(Sizes.borderRadiusFull),
  },
  listItemDetails: {
    flex: 1,
    marginLeft: responsive(Sizes.paddingMedium),
  },
  listItemName: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
  },
  listItemPrice: {
    fontSize: responsive(Sizes.textMedium),
  },
  listItemCategory: {
    fontSize: responsive(Sizes.textNormal),
    color: Colors.light.textSecondary,
  },
  addButton: {
    position: "absolute",
    right: responsive(Sizes.marginHorizontal),
    bottom: responsive(Sizes.marginMedium),
  },
  menuButton: {
    padding: responsive(Sizes.paddingSmall),
  },
  listWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsive(Sizes.paddingLarge),
  },
  emptyStateText: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: responsive(Sizes.marginMedium),
  },
  emptyStateSubtext: {
    fontSize: responsive(Sizes.textNormal),
    textAlign: "center",
    color: Colors.light.textSecondary,
    marginTop: responsive(Sizes.marginSmall),
  },
});
