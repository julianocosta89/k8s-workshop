# k8s-workshop

## Pre-requisites

* Kubernetes cluster:
  * During the workshop we have used [Minikube](https://minikube.sigs.k8s.io/docs/start/)
  * But any other Kubernetes distribution should work
* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

## Samples used for k8s workshop  

* [Frontrail](https://github.com/mthenw/frontail) is used to print out everything the instructor writes in the console to a web app.
* [initial-sample](initial-sample) has the first Pod and Deployment used in the training.
  * In here the services were created manually, by running:
    * For the pod: `kubectl expose pod nginx --port 80 --type NodePort`.
    * For the deployment: `kubectl expose deployment nginx --port 80 --type NodePort`.
    * Note that the pod and the service were deleted before applying the deployment.
* [local-basic-sample](local-basic-sample) has a local sample used to showcase how to build and use local images.
  * Navigate to the [`src`](local-basic-sample/src/) folder:
    * Run the following command to build the image locally:
      * `docker build -t basic-sample .`
    * Navigate back to the `local-basic-sample` and now we can apply our `yaml` files:
      * `kubectl apply -f .`
* [Guestbook app](https://kubernetes.io/docs/tutorials/stateless-application/guestbook/) is a copy from the kubernetes documentation:
  * To deploy it, simply apply it:
    * `kubectl apply -f guestbook_app/`

## Useful commands

Here we have some commands which were used during the workshop:

```shell
kubectl create namespace workshop
kubectl apply -f initial-sample/nginx-pod.yaml 
kubectl get pods
kubectl get pods -n workshop 
kubectl get pods -A

kubectl config set-context --current --namespace=workshop

kubectl expose pod nginx --port 80 --type NodePort
kubectl get svc
kubectl describe svc nginx 
kubectl get pods -o wide

kubectl delete pod nginx 
kubectl delete svc nginx 
kubectl get all

kubectl apply -f initial-sample/nginx-deploy.yaml 
kubectl get pods
kubectl get deploy
kubectl scale deployment nginx --replicas 10
kubectl get pods
kubectl get deploy
kubectl get pods -o wide
kubectl expose deployment nginx --port 80 --type NodePort
kubectl describe svc nginx 
kubectl get svc
kubectl scale deployment nginx --replicas 1
kubectl get pods
kubectl delete pod nginx-<HASH> 
kubectl get pods
kubectl delete deployments.apps nginx 
kubectl delete svc nginx 
kubectl get all

cd local-basic-sample/src
docker build -t basic-sample .
cd ..
kubectl apply -f basic_sample.yaml 
kubectl expose deployment basic-sample --port 8080 --type NodePort --dry-run=client -o yaml
kubectl apply -f basic_sample_svc.yaml 
kubectl get svc
kubectl get pods -o wide

kubectl describe pod basic-sample-<HASH>
kubectl logs basic-sample-<HASH>
kubectl exec -it basic-sample-<HASH> -- env
kubectl exec -it basic-sample-<HASH> -- /bin/sh
# type `exit` to leave the container shell

kubectl delete -f .
kubectl get all

cd ..
kubectl apply -f guestbook_app/
kubectl get pods
kubectl describe pod redis-leader-<HASH>

kubectl get pods -w
kubectl get svc
```
