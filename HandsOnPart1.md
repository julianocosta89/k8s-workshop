# Hands-on Part I

### Training plan
[1. Start minikube.](#start-minikube)<br>
[2. Configure kubectl.](#configure-kubectl)<br>
[3. Create your first namespace!](#create-namespace)<br>
[4. Deploy your first application in the namespace.](#deploy-application)<br>
[5. Expose the application using service.](#expose-app)<br>
[6. Delete the pod and service.](#delete-pod-service)<br>
[7. Create a deployment.](#create-deployment)<br>
[8. Expose the deployment using service.](#expose-deployment-app)<br>

<a name="start-minikube"></a>
## 1. Start minikube.

```bash
ssh ubuntu@<YOUR_MACHINE_IP>
```

In the workshop we will use a *minikube* - a lightweight Kubernetes implementation that allows you to run a simple single-node K8s cluster on your machine. It is already installed on you Linux VM, you just need to start it:

```bash
minikube start --kubernetes-version=v1.23.8 --vm-driver=none
``` 
The output should look like this:
```bash
😄  minikube v1.28.0 on Ubuntu 20.04
✨  Automatically selected the docker driver. Other choices: none, ssh
📌  Using Docker driver with root privileges
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
💾  Downloading Kubernetes v1.25.3 preload ...
    > gcr.io/k8s-minikube/kicbase:  53.02 MiB / 386.27 MiB  13.72% 40.87 MiB p/
    > preloaded-images-k8s-v18-v1...:  385.44 MiB / 385.44 MiB  100.00% 165.52
    > gcr.io/k8s-minikube/kicbase:  386.27 MiB / 386.27 MiB  100.00% 58.19 MiB
    > gcr.io/k8s-minikube/kicbase:  0 B [_______________________] ?% ? p/s 6.6s
🔥  Creating docker container (CPUs=2, Memory=2200MB) ...
🐳  Preparing Kubernetes v1.25.3 on Docker 20.10.20 ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
``` 

Explore the minikube cluster using *kubectl* tool.

```bash
kubectl get nodes
```

To see the controlplane components run:
```bash
kubectl get pods --namespace kube-system
```

Expected output:
```bash
NAME                                      READY   STATUS    RESTARTS   AGE
coredns-64897985d-7298s                   1/1     Running   0          3h2m
etcd-ip-10-0-129-147                      1/1     Running   0          3h2m
kube-apiserver-ip-10-0-129-147            1/1     Running   0          3h2m
kube-controller-manager-ip-10-0-129-147   1/1     Running   0          3h2m
kube-proxy-jrklv                          1/1     Running   0          3h2m
kube-scheduler-ip-10-0-129-147            1/1     Running   0          3h2m
storage-provisioner                       1/1     Running   0          3h2m
```

Check Node Components - Container Runtime (Docker) and kubelet.

```bash
sudo systemctl status docker
sudo systemctl status kubelet
```

<a name="configure-kubectl"></a>
## 2. Configure kubectl.
```bash
source <(kubectl completion bash) # set up autocomplete in bash into the current shell, bash-completion package should be installed first.
echo "source <(kubectl completion bash)" >> ~/.bashrc # add autocomplete permanently to your bash shell.

alias k=kubectl
complete -o default -F __start_kubectl k
```
<a name="create-namespace"></a>
## 3. Create your first namespace!
3.1. Create the ***workshop*** namespace running the command:
```bash
kubectl create namespace workshop
``` 
or
```bash
kubectl create ns workshop
``` 
Expected output:
```bash
namespace/workshop created
```
<a name="deploy-application"></a>
## 4. Deploy your first application in the namespace.
You will run your first application in a container on K8s now. It will be an NGINX server.

To run the container we will use the application manifest *nginx-pod.yaml* located in the *initial-sample* directory.

4.1. Run the command:

```bash
cd k8s-workshop
kubectl apply -f initial-sample/nginx-pod.yaml 
```
Note that output says:
```bash
pod/nginx created
```
It informs us that the ***pod*** resource has been created. On K8s we don't run containers, we run ***PODs***. A ***POD*** can be 1 or more containers.

4.2. To list the pods running on K8s use command:
```bash
kubectl get pods
```
This command gives us the output:
```bash
No resources found in default namespace.
```
What is wrong? :) 
What do we have to change?

<a name="expose-app"></a> 
## 5. Expose the application using service.

The NGINX application runs on K8s now. But it is not available to the outside world yet. 

**5.1.** To make it reachable we will use the command:

```bash
kubectl config set-context --current --namespace=workshop
kubectl expose pod nginx --port 80 --type NodePort
```
Expected output:
```bash
service/nginx exposed
```
This command will create for us the service of the ***NodePort*** type.

**5.2.** To list the services use commands:
```bash
kubectl get svc
```
Expected output:
```bash
NAME    TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
nginx   NodePort   10.107.166.0   <none>        80:31182/TCP   4m58s
```
**5.3.** Describe the service:
```bash
kubectl describe svc nginx 
```
Expected output:
```bash
Name:                     nginx
Namespace:                workshop
Labels:                   app=nginx
Annotations:              <none>
Selector:                 app=nginx
Type:                     NodePort
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.107.166.0
IPs:                      10.107.166.0
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  31182/TCP
Endpoints:                172.17.0.3:80
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

**5.4.** List pods with details:
```bash
kubectl get pods -o wide
```
Expected output:
```bash
NAME    READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
nginx   1/1     Running   0          28m   172.17.0.3   minikube   <none>           <none>
```
<a name="delete-pod-service"></a>
## 6. Delete the pod and service.
**6.1.** Clean up all created resources.
```bash
kubectl delete pod nginx 
kubectl delete svc nginx 
kubectl get all
```
Expected output:
```bash
pod "nginx" deleted
service "nginx" deleted
No resources found in workshop namespace.
```
<a name="create-deployment"></a>
## 7. Create a deployment.
**7.1.** Deploy the application as a Deployment resource, not a single pod, use command: 
```bash
kubectl apply -f initial-sample/nginx-deploy.yaml 
```
Expected output:
```bash
deployment.apps/nginx created
```
**7.2.** Explore the resources created with the deployment manifest. Use commands below.

```bash
kubectl get pods
kubectl get deploy
```
**7.3.** Scale the deployment to 10 replicas.
```bash
kubectl scale deployment nginx --replicas 10
kubectl get pods
```
Observe what happens:
```bash
NAME                     READY   STATUS              RESTARTS   AGE
nginx-7fb96c846b-275mf   0/1     Pending             0          0s
nginx-7fb96c846b-2t9rg   0/1     ContainerCreating   0          0s
nginx-7fb96c846b-5m4rr   0/1     Pending             0          0s
nginx-7fb96c846b-8bjdc   0/1     Pending             0          0s
nginx-7fb96c846b-cvb6s   0/1     Pending             0          0s
nginx-7fb96c846b-kcbfq   1/1     Running             0          2m50s
nginx-7fb96c846b-kjqrz   0/1     Pending             0          0s
nginx-7fb96c846b-kmxnb   0/1     Pending             0          0s
nginx-7fb96c846b-nhpzq   0/1     Pending             0          0s
nginx-7fb96c846b-zjhdp   0/1     Pending             0          0s
```
The new containers are being created. The are in the **pending** state. After a few seconds all containers are running.
```bash
NAME                     READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
nginx-7fb96c846b-275mf   1/1     Running   0          10s   172.17.0.5    minikube   <none>           <none>
nginx-7fb96c846b-2t9rg   1/1     Running   0          10s   172.17.0.6    minikube   <none>           <none>
nginx-7fb96c846b-5m4rr   1/1     Running   0          10s   172.17.0.4    minikube   <none>           <none>
nginx-7fb96c846b-8bjdc   1/1     Running   0          10s   172.17.0.7    minikube   <none>           <none>
nginx-7fb96c846b-cvb6s   1/1     Running   0          10s   172.17.0.11   minikube   <none>           <none>
nginx-7fb96c846b-kcbfq   1/1     Running   0          3m    172.17.0.3    minikube   <none>           <none>
nginx-7fb96c846b-kjqrz   1/1     Running   0          10s   172.17.0.8    minikube   <none>           <none>
nginx-7fb96c846b-kmxnb   1/1     Running   0          10s   172.17.0.9    minikube   <none>           <none>
nginx-7fb96c846b-nhpzq   1/1     Running   0          10s   172.17.0.10   minikube   <none>           <none>
nginx-7fb96c846b-zjhdp   1/1     Running   0          10s   172.17.0.12   minikube   <none>           <none>
```
**7.4.** Explore the deployment and pods.

```bash
kubectl get deploy
kubectl get pods -o wide
```
<a name="expose-deployment-app"></a>
## 8. Expose the deployment using service.
**8.1.** Expose the deployment using NodePort service.
```bash
kubectl expose deployment nginx --port 80 --type NodePort
```
Expected output:
```bash
service/nginx exposed
```
**8.2.** Describe the service:
```bash
kubectl describe svc nginx
```
Expected output:
```bash
Name:                     nginx
Namespace:                workshop
Labels:                   app=nginx
Annotations:              <none>
Selector:                 app=nginx
Type:                     NodePort
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.109.189.243
IPs:                      10.109.189.243
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  30971/TCP
Endpoints:                172.17.0.10:80,172.17.0.11:80,172.17.0.12:80 + 7 more...
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```
**8.3.** Scale down the deployment to 1 replica.
```bash 
kubectl scale deployment nginx --replicas 1
```

and observe what happens:
```bash
kubectl get pods
```
Expected output:
```bash
NAME                     READY   STATUS        RESTARTS   AGE
nginx-7fb96c846b-275mf   1/1     Terminating   0          3m33s
nginx-7fb96c846b-2t9rg   1/1     Terminating   0          3m33s
nginx-7fb96c846b-5m4rr   1/1     Terminating   0          3m33s
nginx-7fb96c846b-8bjdc   1/1     Terminating   0          3m33s
nginx-7fb96c846b-cvb6s   1/1     Terminating   0          3m33s
nginx-7fb96c846b-kcbfq   1/1     Running       0          6m23s
nginx-7fb96c846b-kjqrz   1/1     Terminating   0          3m33s
nginx-7fb96c846b-kmxnb   1/1     Terminating   0          3m33s
nginx-7fb96c846b-nhpzq   1/1     Terminating   0          3m33s
nginx-7fb96c846b-zjhdp   1/1     Terminating   0          3m33s
```



**8.4.** Try deleting one of the pods.
```bash
kubectl delete pod nginx-<HASH> 
kubectl get pods
```
What happens? Why?

**8.5.** Delete the deployment and service.
```bash
kubectl delete deployments.apps nginx 
kubectl delete svc nginx 
kubectl get all
```
Expected output:
```bash
deployment.apps "nginx" deleted
service "nginx" deleted
No resources found in workshop namespace.
```
<a name=""></a>
## 9. Build Docker image locally and run it on K8s.

```bash
cd local-basic-sample/src
docker build -t basic-sample .
cd ..
kubectl apply -f basic_sample.yaml 
kubectl expose deployment basic-sample --port 8080 --type NodePort --dry-run=client -o yaml
kubectl apply -f basic_sample_svc.yaml 
kubectl get svc
kubectl get pods -o wide
```
<a name=""></a>
## 10. Explore the workloads with kubectl.
```bash
kubectl describe pod basic-sample-<HASH>
kubectl logs basic-sample-<HASH>
kubectl exec -it basic-sample-<HASH> -- env
kubectl exec -it basic-sample-<HASH> -- /bin/sh
```
