<template>
	<div class="w-full h-screen flex flex-col overflow-hidden">
        <DefaultLayout>
		<div class="w-full max-w-full mx-auto h-full flex flex-row border-x" style="max-height: calc(100vh - 8rem)">
			<Rooms/>
			<Inbox v-if="showInbox && hasRooms && !showCreateForm" />
			<CreateRoom v-else/>
			<Loading v-if="!showInbox && hasRooms" />
			<LookupModal v-if="showLookupModal"/>
			<RoomDetailsWrapper />
		</div>
        </DefaultLayout>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import DefaultLayout from '../layouts/default.vue'
import Inbox from '../components/chat/Inbox.vue'
import Rooms from '../components/chat/Rooms.vue'
import CreateRoom from '../components/chat/CreateRoom.vue'
import RoomDetailsWrapper from '../components/chat/RoomDetailsWrapper.vue'
import useStore from '../store'
import { ChatRoom } from '../store/chat'
import { io, Socket } from 'socket.io-client'
import Loading from '../components/Loading.vue'
import axios, { AxiosResponse } from 'axios'
import LookupModal from '../components/chat/LookupModal.vue'

export default defineComponent({
	name: 'Chat',
	components: { DefaultLayout, Rooms, Inbox, CreateRoom, RoomDetailsWrapper, Loading, LookupModal },
	data() {
		const store = useStore();
		return {
			store,
			showLookupModal: computed(() => store.state.chat.showLookup),
			showInbox: computed(() => store.state.chat.showInbox),
			hasRooms: computed(() => store.state.chat.hasRoom),
			showCreateForm: computed(() => store.state.chat.showCreateForm),
			currentUserId: computed(() => store.state.auth.user?.id),
			rooms: computed(() => store.state.chat.rooms),
			// roomCount: computed(() => store.state.chat.rooms.length),
			setRooms: (data: ChatRoom[]) => store.commit('chat/userRooms', data),
			setHasRoom: (data: boolean) => store.commit('chat/setHasRoom', data),
			setSocket: (socket: Socket) => store.commit('chat/setSocket', socket),
		}
	},
	async mounted() { //fetch current user rooms, public rooms and friends list
		let roomName = null;
		await axios
					.get('http://localhost:9000/api/chat', { withCredentials: true })
					.then((data: AxiosResponse) => {
						this.setRooms(data.data);
						roomName = data.data?.[0]?.name || null;
					})
					.catch(err => console.log(err));
		this.rooms.forEach(room => {
				if ( room.members.find(e => e === this.currentUserId) !== undefined) {
					this.setHasRoom(true);
					return;
				}
		});
		// await fetch('http://localhost:9000/api/chat')
		// 			.then(res => res.json())
		// 			.then(data => {
		// 				this.setRooms(data);
		// 				roomName = data?.[0]?.name || null;
		// 				// TODO: Join default room
		// 			})
		// 			.catch(err => console.log(err))
		const socket = io('http://localhost:4000/chat');
		
		socket.on('connect', () => {
			setTimeout ( () => {
				socket.emit('logId', this.currentUserId);
			}, 700);
		});
		this.setSocket(socket);
		socket.on('startGame', (payload: number) => {
			this.$router.push(`/custom-game/${payload}`);
		})

		// socket.emit('joinRoom', roomName);
	}
	// watch: {
	// 	roomCount(newVal, oldVal) {
	// 		console.log(this.hasRooms + ' ' + newVal)
	// 		this.toggleHasRoom(newVal > 0);
	// 		// newVal > 0 ? this.hasRooms = true : this.hasRooms = false;
	// 	}
	// },
})
</script>


<style>
</style>
