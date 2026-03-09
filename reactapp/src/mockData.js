//// services/api.js — swap these with real Axios calls to Spring Boot
//export const mockStats = {
//  totalEvents: 24,
//  totalVolunteers: 187,
//  pendingRequests: 9,
//  verificationStatus: "Verified", // "Pending" | "Verified" | "Rejected"
//};
//
////export const mockEvents = [
////  { id: 1, title: "Coastal Cleanup Drive", date: "2026-03-20", location: "Marina Beach, Chennai", volunteers: 34, capacity: 50, status: "Active", category: "Environment" },
////  { id: 2, title: "Free Health Camp", date: "2026-03-25", location: "Tambaram Community Hall", volunteers: 22, capacity: 30, status: "Active", category: "Health" },
////  { id: 3, title: "Digital Literacy Workshop", date: "2026-04-02", location: "Sholinganallur Tech Park", volunteers: 18, capacity: 25, status: "Upcoming", category: "Education" },
////  { id: 4, title: "Tree Plantation Drive", date: "2026-04-10", location: "Adyar Eco Park", volunteers: 41, capacity: 60, status: "Upcoming", category: "Environment" },
////  { id: 5, title: "Blood Donation Camp", date: "2026-02-14", location: "Anna Nagar, Chennai", volunteers: 55, capacity: 50, status: "Completed", category: "Health" },
////  { id: 6, title: "Youth Leadership Summit", date: "2026-02-28", location: "IIT Madras", volunteers: 80, capacity: 100, status: "Completed", category: "Education" },
////];
//
//export const mockRequests = [
//  { id: 1, name: "Deepa Raghavan", email: "deepa.r@email.com", event: "Coastal Cleanup Drive", date: "Mar 12, 2026", skills: ["Logistics", "Swimming"], status: "Pending", avatar: "DR" },
//  { id: 2, name: "Karthik Subramanian", email: "karthik.s@email.com", event: "Free Health Camp", date: "Mar 11, 2026", skills: ["First Aid", "Nursing"], status: "Pending", avatar: "KS" },
//  { id: 3, name: "Nithya Balaji", email: "nithya.b@email.com", event: "Digital Literacy Workshop", date: "Mar 10, 2026", skills: ["Teaching", "Computers"], status: "Pending", avatar: "NB" },
//  { id: 4, name: "Surya Prakash", email: "surya.p@email.com", event: "Tree Plantation Drive", date: "Mar 9, 2026", skills: ["Gardening", "Driving"], status: "Pending", avatar: "SP" },
//  { id: 5, name: "Aishwarya Murugan", email: "aish.m@email.com", event: "Coastal Cleanup Drive", date: "Mar 8, 2026", skills: ["Outreach", "Social Media"], status: "Pending", avatar: "AM" },
//  { id: 6, name: "Rahul Venkatesh", email: "rahul.v@email.com", event: "Blood Donation Camp", date: "Mar 7, 2026", skills: ["Medical", "Counseling"], status: "Approved", avatar: "RV" },
//  { id: 7, name: "Preethi Srinivasan", email: "preethi.s@email.com", event: "Youth Leadership Summit", date: "Mar 6, 2026", skills: ["Public Speaking", "Event Mgmt"], status: "Rejected", avatar: "PS" },
//];
//
//export const mockMembers = [
//  { id: 1, name: "Arjun Krishnamurthy", email: "arjun.k@email.com", role: "Coordinator", events: 14, joined: "Jan 2024", status: "Active", avatar: "AK" },
//  { id: 2, name: "Meenakshi Iyer", email: "meenakshi.i@email.com", role: "Volunteer", events: 9, joined: "Mar 2024", status: "Active", avatar: "MI" },
//  { id: 3, name: "Vijay Anand", email: "vijay.a@email.com", role: "Volunteer", events: 7, joined: "Jun 2024", status: "Active", avatar: "VA" },
//  { id: 4, name: "Divya Chandrasekaran", email: "divya.c@email.com", role: "Team Lead", events: 19, joined: "Nov 2023", status: "Active", avatar: "DC" },
//  { id: 5, name: "Balaji Natarajan", email: "balaji.n@email.com", role: "Volunteer", events: 5, joined: "Aug 2024", status: "Inactive", avatar: "BN" },
//  { id: 6, name: "Kavitha Rajan", email: "kavitha.r@email.com", role: "Coordinator", events: 11, joined: "Feb 2024", status: "Active", avatar: "KR" },
//  { id: 7, name: "Senthil Kumar", email: "senthil.k@email.com", role: "Volunteer", events: 3, joined: "Oct 2024", status: "Active", avatar: "SK" },
//  { id: 8, name: "Lakshmi Narayanan", email: "lakshmi.n@email.com", role: "Team Lead", events: 16, joined: "Dec 2023", status: "Active", avatar: "LN" },
//];
//
//export const mockChartData = [
//  { month: "Oct", events: 3, volunteers: 42 },
//  { month: "Nov", events: 5, volunteers: 68 },
//  { month: "Dec", events: 2, volunteers: 31 },
//  { month: "Jan", events: 7, volunteers: 94 },
//  { month: "Feb", events: 6, volunteers: 87 },
//  { month: "Mar", events: 4, volunteers: 55 },
//];
//
//export const mockNotifications = [
//  { id: 1, msg: "5 new volunteer requests need review", time: "2 min ago", type: "request", unread: true },
//  { id: 2, msg: "Coastal Cleanup Drive starts in 3 days", time: "1 hr ago", type: "event", unread: true },
//  { id: 3, msg: "Your NGO verification was approved", time: "2 hr ago", type: "verify", unread: true },
//  { id: 4, msg: "Arjun completed 14 events milestone", time: "1 day ago", type: "member", unread: false },
//];
