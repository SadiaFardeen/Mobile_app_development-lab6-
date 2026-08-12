import SearchBar from "@/components/search-bar";
import StudentDetail from "@/components/student-detail";
import StudentItem from "@/components/student-item";
import { Student } from "@/data/students";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudents } from "../../context/students-context";
import { useDebounce } from "../../hooks/use-debounce";

export default function HomePage() {
  const [query, setQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const { students } = useStudents();

  const searchRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const debouncedQuery = useDebounce(query, 300);

  cconst filtered = useMemo(() => {
  const normalizedQuery = debouncedQuery.toLowerCase();

  return students.filter(
    (s) =>
      s.name.toLowerCase().includes(normalizedQuery) ||
      s.department.toLowerCase().includes(normalizedQuery)
  );
}, [students, debouncedQuery]);

  const handleSelect = useCallback((student: Student) => {
    setSelectedStudent((prev) =>
      prev?.id === student.id ? null : student
    );
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Student Directory</Text>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/(tabs)/add-student")}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      <SearchBar
        ref={searchRef}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentItem
            student={item}
            onPress={handleSelect}
            isSelected={selectedStudent?.id === item.id}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No students match "{query}"
            </Text>
          </View>
        }
      />

      {selectedStudent && (
        <StudentDetail
          student={selectedStudent}
          onRemoved={() => setSelectedStudent(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },

  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#0D1F4E",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  addButton: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  empty: {
    padding: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
  },
});